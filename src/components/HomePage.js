import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const [albums, setAlbums] = useState([]);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        artist: '',
        genre: '',
        image: '',
        description: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/api/albums')
            .then((response) => {
                setAlbums(response.data);
            })
            .catch((error) => {
                console.error('Error fetching albums:', error);
            });
    }, []);


    const handleNewAlbumChange = (e) => {
        const { name, value } = e.target;
        setNewAlbum({ ...newAlbum, [name]: value });
    };


    const handleAddAlbum = (e) => {
        e.preventDefault();

        if (newAlbum.title && newAlbum.artist && newAlbum.genre && newAlbum.image && newAlbum.description) {
            axios.post('http://localhost:3001/api/albums', newAlbum)
                .then((response) => {
                    setAlbums([...albums, response.data]);
                    setNewAlbum({ title: '', artist: '', genre: '', image: '', description: '' });
                    navigate(`/album/${response.data._id}`);
                })
                .catch((error) => {
                    console.error('Error adding album:', error);
                });
        } else {
            alert('Please fill in all the fields.');
        }
    };

    return (
        <div className="home-page">


            <h3>Add New Album</h3>
            <form onSubmit={handleAddAlbum} className="add-album-form">
                <div className="form-group">
                    <label>Album Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={newAlbum.title}
                        onChange={handleNewAlbumChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Artist:</label>
                    <input
                        type="text"
                        name="artist"
                        value={newAlbum.artist}
                        onChange={handleNewAlbumChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Genre:</label>
                    <input
                        type="text"
                        name="genre"
                        value={newAlbum.genre}
                        onChange={handleNewAlbumChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image URL:</label>
                    <input
                        type="url"
                        name="image"
                        value={newAlbum.image}
                        onChange={handleNewAlbumChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={newAlbum.description}
                        onChange={handleNewAlbumChange}
                        required
                    />
                </div>

                <button type="submit">Add Album</button>
            </form>


            <h3>Existing Albums</h3>
            <div className="albums-list">
                {albums.length === 0 ? (
                    <p>No albums available. Add some albums!</p>
                ) : (
                    albums.map((album) => (
                        <div
                            key={album._id}
                            className="album-card"
                            onClick={() => navigate(`/album/${album._id}`)}
                        >
                            <img src={album.image} alt={album.title} className="album-image" />
                            <h4>{album.title}</h4>
                            <p>{album.artist}</p>
                            <p>{album.genre}</p>
                            <p>{album.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
