import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, Route, useParams, useHistory } from "react-router-dom";
import { getOnePlaylist, deleteSonginPlaylist, editOnePlaylist } from '../../store/playlist'
import PlaylistsPlay from "./playlistPlay";
import '../../css-package/playlist.css'

function PlaylistsDetails({ playing, setPlaying, setSongName, setArtistName }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { playlistId } = useParams();
    const theList = useSelector(state => state.playlist);
    const sessionUser = useSelector(state => state.session.user);
    const [listLoaded, setListLoaded] = useState(false);
    const [songSelect, setSongSelect] = useState();
    const [playPlaylist, setPlayPlaylist] = useState(false);
    const [played, setPlayed] = useState(false);

    useEffect(() => {
        dispatch(getOnePlaylist(playlistId)).then(() => {
            setListLoaded(true);
            setnewPlaylistName(theList?.name);
            setnewPreviewImage(theList?.previewImage);
        })
    }, [dispatch, playlistId, theList?.Songs?.length])

    const [newPlaylistName, setnewPlaylistName] = useState(theList?.name);
    const [newPreviewImage, setnewPreviewImage] = useState(theList?.previewImage);

    const [readyEdit, setReadyEdit] = useState(false);
    // const theList = useSelector(state => Object.values(state.playlist));


    const handleRemoveSong = async e => {
        e.preventDefault();
        const id = e.target.value;
        const playload = {
            playlistId,
            songId: id
        }
        await dispatch(deleteSonginPlaylist(playload))
            .then(() => {
                // window.alert('Sone is now deleted from Playlist')
                dispatch(getOnePlaylist(playlistId))
            })
    }

    const handleEditPlaylist = async e => {
        e.preventDefault();
        const playload = {
            id: playlistId,
            name: newPlaylistName,
            previewImage: newPreviewImage
        }
        await dispatch(editOnePlaylist(playload))
            .then(() => {
                setReadyEdit(false);
                dispatch(getOnePlaylist(playlistId))
            })
    }

    const handleHomePlay = async (e, song) => {
        e.preventDefault();
        await setPlaying(e.target.value);
        await setSongName(song.title);
        await setArtistName(song.Artist.username);
        let homePlayer = document.getElementById('botton-player-bar');
        if (played && songSelect == song.id) {
            homePlayer.pause();
            setPlayed(false);
            setSongSelect();
        }
        else {
            homePlayer.load();
            homePlayer.play();
            setSongSelect(song.id)
            setPlayed(true);
        }
    }

    if (!sessionUser) {
        history.push('/');
        // window.alert('You are now logged out')
    }

    return listLoaded && (
        <div className="myplaylist-container">
            {readyEdit ?
                (<div className="mylist-two">
                    <form>
                        <img src={newPreviewImage} height={'300px'}></img>
                        <input
                            required
                            placeholder="Playlist Name here"
                            value={newPlaylistName}
                            onChange={e => setnewPlaylistName(e.target.value)}
                        ></input>
                        <input
                            required
                            placeholder="Preview Image URL here"
                            value={newPreviewImage}
                            onChange={e => setnewPreviewImage(e.target.value)}
                        ></input>
                        <div>* Length of Playlist name must be within 2 and 80.</div>
                        <div>
                            <button onClick={handleEditPlaylist}>Update Now</button>
                            <button onClick={() => setReadyEdit(false)}>Cancel Update</button>
                        </div>
                    </form>
                </div>) :
                <div className="mylist-one">
                    {!playPlaylist && <PlaylistsPlay />}
                    <img src={theList.previewImage} height={'600px'}></img>
                    <div>{theList?.name}</div>
                    {(sessionUser?.id === theList?.userId) && <button onClick={() => setReadyEdit(true)}>Edit This Playlist</button>}
                </div>
            }
            {(theList?.Songs?.length === 0) ? (
                <div className="mylist-right-no">You have not added songs to this playlist</div>
            ) : <div className="mylist-right-yes">
                {theList.Songs.map(each => {
                    return <div key={each.id} className='mylist-right-yes-each'>
                        <div className="mylist-yes-details">
                            <button className="mylist-yes-play" onClick={e => handleHomePlay(e, each)} value={each.url}>{(songSelect === each?.id) ? '||' : '▶'}</button>
                            <NavLink to={`/songs/${each?.id}`}>{each.title}</NavLink>
                        </div>
                        {(sessionUser?.id === theList?.userId) && <div className="mylist-yes-remove">
                            <button value={each?.id} onClick={handleRemoveSong}>Remove</button>
                        </div>
                        }
                    </div>
                })}
            </div>
            }
        </div>
    )
}

export default PlaylistsDetails;
