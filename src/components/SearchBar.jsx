import { View, StyleSheet, TextInput, Dimensions } from 'react-native'
import React from 'react'
import { Search } from 'lucide-react-native';
const { width, height } = Dimensions.get('window');
const SearchBar = () => {
    return (
        <View style={[styles.searchContainer]}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"

            />
            <Search color="#6B7280" size={20} style={styles.searchIcon} />
        </View>
    )
}

const styles = StyleSheet.create({

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 24,
        paddingVertical: 18,
        marginTop: 16,
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        padding: 0,
    },

})

export default SearchBar