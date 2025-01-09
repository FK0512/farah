import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const API_URL = 'https://api.github.com/search/repositories?q=';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchRepositories = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}${searchText}`);
      setRepositories(response.data.items || []);
    } catch (error) {
      alert('Error fetching repositories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (repo) => {
    if (!favorites.find((fav) => fav.id === repo.id)) {
      setFavorites([...favorites, repo]);
      alert(`${repo.name} added to favorites!`);
    } else {
      alert(`${repo.name} is already in favorites.`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.repoContainer, darkMode && styles.repoContainerDark]}
      onPress={() => navigation.navigate('Details', { repo: item })}
    >
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <View style={styles.repoDetails}>
        <Text style={[styles.repoName, darkMode && styles.repoNameDark]}>{item.name}</Text>
        <Text style={darkMode && styles.textDark}>{item.description || 'No description available'}</Text>
        <Text style={darkMode && styles.textDark}>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={darkMode && styles.textDark}>Updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
        <TouchableOpacity
          style={[styles.favoriteButton, darkMode && styles.favoriteButtonDark]}
          onPress={() => addFavorite(item)}
        >
          <Text style={styles.favoriteButtonText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Switch
        value={darkMode}
        onValueChange={setDarkMode}
        style={styles.darkModeSwitch}
      />
      <TextInput
        style={[styles.searchInput, darkMode && styles.searchInputDark]}
        placeholder="Search Repositories"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.searchButton} onPress={fetchRepositories}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={() => navigation.navigate('Favorites', { favorites, setFavorites })}
      >
        <Text style={styles.navigateButtonText}>View Favorites</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const DetailsScreen = ({ route, navigation }) => {
  const { repo } = route.params;
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContributors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(repo.contributors_url);
      setContributors(response.data);
    } catch (error) {
      alert('Error fetching contributors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  return (
    <View style={[styles.container, styles.containerDark]}>
      <Text style={styles.detailsTitle}>{repo.name}</Text>
      <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatarLarge} />
      <Text>Owner: {repo.owner.login}</Text>
      <Text>Description: {repo.description || 'No description available'}</Text>
      <Text>Stars: {repo.stargazers_count}</Text>
      <Text>Forks: {repo.forks_count}</Text>
      <Text>Language: {repo.language || 'N/A'}</Text>
      <Text>Created: {new Date(repo.created_at).toLocaleDateString()}</Text>
      <Text>Updated: {new Date(repo.updated_at).toLocaleDateString()}</Text>
      <Text style={styles.detailsTitle}>Contributors</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={contributors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.repoContainer}>
              <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              <Text>{item.login}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const FavoritesScreen = ({ route }) => {
  const { favorites, setFavorites } = route.params;

  const removeFavorite = (repoId) => {
    setFavorites(favorites.filter((item) => item.id !== repoId));
    alert('Repository removed from favorites.');
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.repoContainer}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <View style={styles.repoDetails}>
        <Text style={styles.repoName}>{item.name}</Text>
        <Text>{item.description || 'No description available'}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.detailsTitle}>Favorite Repositories</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
      />
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  searchInputDark: {
    backgroundColor: '#555',
    borderColor: '#777',
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navigateButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  repoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  repoContainerDark: {
    backgroundColor: '#444',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: 'center',
  },
  repoDetails: {
    flex: 1,
  },
  repoName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  repoNameDark: {
    color: '#fff',
  },
  favoriteButton: {
    marginTop: 8,
    backgroundColor: '#ffc107',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  favoriteButtonDark: {
    backgroundColor: '#bb8600',
  },
  favoriteButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  textDark: {
    color: '#ccc',
  },
  darkModeSwitch: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
});
