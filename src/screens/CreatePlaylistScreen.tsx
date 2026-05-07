import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Switch,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import { createPlaylist } from '../services/jellyfin/library';

const CreatePlaylistScreen = ({ navigation }: any) => {
    const [playlistName, setPlaylistName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [cover, setCover] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { serverUrl, token, userid } = useSelector((s: RootState) => s.auth);

    const handleCreate = async () => {
        if (!playlistName.trim()) {
            Alert.alert('Error', 'Please enter a playlist name');
            return;
        }

        setLoading(true);
        try {
            await createPlaylist({
                name: playlistName,
                userId: userid,
                token,
                serverUrl,
            });
            // Navigate back and maybe refresh
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to create playlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>New Playlist</Text>

                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Cover Upload */}
                <View style={styles.coverSection}>
                    <View style={styles.coverBox}>
                        {cover ? (
                            <Image source={{ uri: cover }} style={styles.coverImage} />
                        ) : (
                            <Icon name="image" size={64} color="rgba(185,13,242,0.4)" />
                        )}

                        <TouchableOpacity style={styles.cameraButton}>
                            <Icon name="add-a-photo" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.uploadButton}>
                        <Icon name="upload" size={16} color="#b90df2" />
                        <Text style={styles.uploadText}>Upload Cover</Text>
                    </TouchableOpacity>
                </View>

                {/* Playlist Name */}
                <View style={styles.field}>
                    <Text style={styles.label}>Playlist Name</Text>
                    <TextInput
                        value={playlistName}
                        onChangeText={setPlaylistName}
                        placeholder="My Awesome Mix #1"
                        placeholderTextColor="#777"
                        style={styles.input}
                    />
                </View>

                {/* Description */}
                <View style={styles.field}>
                    <Text style={styles.label}>
                        Description <Text style={{ color: '#777' }}>(Optional)</Text>
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Give your playlist a cool description..."
                        placeholderTextColor="#777"
                        multiline
                        style={[styles.input, styles.textArea]}
                    />
                </View>

                {/* Visibility Toggle */}
                <View style={styles.toggleRow}>
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 }}>
                        <Icon name="public" size={20} color="#b90df2" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.toggleTitle}>Make Public</Text>
                            <Text style={styles.toggleSubtitle}>
                                Others can find and follow this playlist
                            </Text>
                        </View>
                    </View>

                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ true: '#b90df2' }}
                    />
                </View>

                {/* Create Button */}
                <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.createText}>Create Playlist</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreatePlaylistScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1022',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },

    /* Cover */
    coverSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    coverBox: {
        width: 240,
        height: 240,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(185,13,242,0.3)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(185,13,242,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    coverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: '#b90df2',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(185,13,242,0.4)',
    },
    uploadText: {
        color: '#b90df2',
        fontWeight: '600',
    },

    /* Form */
    field: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#2a1630',
        borderRadius: 14,
        padding: 14,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(185,13,242,0.2)',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },

    /* Toggle */
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2a1630',
        padding: 16,
        borderRadius: 14,
        marginBottom: 30,
    },
    toggleTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    toggleSubtitle: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2,
    },

    /* Create Button */
    createButton: {
        backgroundColor: '#b90df2',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#b90df2',
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 6,
    },
    createText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
