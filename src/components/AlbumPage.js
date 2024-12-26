import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AlbumPage = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/albums/${id}`);
                setAlbum(response.data);
                setError(null);
            } catch (err) {
                setError('Error fetching album data');
                console.error('Error fetching album:', err);
            }
        };

        fetchAlbum();
    }, [id]);

    const handleNewSongChange = (e) => {
        const { name, value } = e.target;
        setNewSong({ ...newSong, [name]: value });
    };

    const handleAddSong = async (e) => {
        e.preventDefault();

        if (newSong.title && newSong.artist && newSong.duration) {
            try {
                const response = await axios.post(
                    `http://localhost:3001/api/albums/${id}/songs`,
                    newSong
                );
                setAlbum((prevAlbum) => ({
                    ...prevAlbum,
                    songs: [...prevAlbum.songs, response.data.songs[prevAlbum.songs.length]],
                }));
                setNewSong({ title: '', artist: '', duration: '' });
            } catch (err) {
                console.error('Error adding song:', err);
            }
        }
    };

    const handleDeleteSong = async (songId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/albums/${id}/songs/${songId}`);
            if (response.status === 200) {
                setAlbum((prevAlbum) => ({
                    ...prevAlbum,
                    songs: prevAlbum.songs.filter((song) => song._id !== songId),
                }));
            }
        } catch (err) {
            console.error('Error deleting song:', err);
        }
    };

    const handleDeleteAlbum = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/albums/${id}`);
            navigate('/');
        } catch (err) {
            console.error('Error deleting album:', err);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!album) {
        return <div>Loading album...</div>;
    }

    return (
        <div className="album-page">
            <h2>{album.title} - {album.artist}</h2>
            <img src={album.image} alt={`${album.title} album cover`} className="album-image" />
            <p>Genre: {album.genre}</p>

            <h3>Songs</h3>
            <ul>
                {album.songs.length > 0 ? (
                    album.songs.map((song) => (
                        <li key={song._id}>
                            <p>{song.title} - {song.artist} ({song.duration})</p>
                            <button onClick={() => handleDeleteSong(song._id)} className="delete-btn">
                                Delete Song
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No songs added yet.</p>
                )}
            </ul>

            <h4>Add New Song</h4>
            <form onSubmit={handleAddSong} className="add-song-form">
                <div className="form-group">
                    <label>Song Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={newSong.title}
                        onChange={handleNewSongChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Artist:</label>
                    <input
                        type="text"
                        name="artist"
                        value={newSong.artist}
                        onChange={handleNewSongChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Duration:</label>
                    <input
                        type="text"
                        name="duration"
                        value={newSong.duration}
                        onChange={handleNewSongChange}
                        required
                    />
                </div>

                <button type="submit">Add Song</button>
            </form>

            <div className="album-actions">
                <button onClick={handleDeleteAlbum} className="delete-album-btn">
                    Delete Album
                </button>
                <button onClick={() => navigate('/')} className="back-btn">
                    Back to Homepage
                </button>
            </div>
        </div>
    );
};

export default AlbumPage;
