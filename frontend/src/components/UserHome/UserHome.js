import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Coverflow from 'react-coverflow';
import songReducer, { getAllSongs } from '../../store/song'
// import bg from '../../images/red-vinyl.gif'
import bg from '../../images/drum.gif'
// import bg from '../../images/vinyl-gif.gif'
// import bg from '../../images/sunrise.jpeg'
import { getUserDetail } from '../../store/user'
import LoginForm from '../LoginFormModal/LoginForm'

import { createRoot } from 'react-dom/client';
import { Carousel, CarouselItem } from 'react-round-carousel';
import 'react-round-carousel/src/index.css';


const TestUserHome = ({ playing, setPlaying, setSongName, setArtistName }) => {
    const dispatch = useDispatch();
    const [played, setPlayed] = useState(false)
    const [homesongloaded, setHomesongloaded] = useState(false)
    const [songSelect, setSongSelect] = useState();
    const sessionUser = useSelector(state => state.session.user);
    const allsongs = useSelector(state => Object.values(state.song))

    // Create an array of Carousel Items
    // const items: CarouselItem[] = Array(20)
    //     .fill('')
    //     .map((_: string, index: number) => ({
    //         alt: 'A random photo',
    //         image: `https://picsum.photos/${210 + index}`,
    //         content: (
    //             <div>
    //                 <strong>Round Carousel</strong>
    //                 <span>Slide number {index + 1}</span>
    //             </div>
    //         )
    //     }));
    const items: CarouselItem[] = allsongs?.map(song => ({
        alt: `${song.title}`,
        image: `${song.previewImage}`,
        content: (
            <div>
                <span>{song.title}</span>
                    <button  className="home-songplay-button" value={song.url} onClick={e => handleHomePlay(e, song)} >{(songSelect === song?.id) ? '||' : '▶'}</button>
            </div>
        )
    }));


    useEffect(() => {
        dispatch(getAllSongs()).then(() => setHomesongloaded(true))
    }, [dispatch])


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



    // const ppbutton = played ?'❚ ❚':'▶'

    return homesongloaded && (
        <div id='home-middle'>
            {sessionUser ? (
                <div className='public-home'>
                    <h2 className='public-greeting'>Welcome back, {sessionUser?.username}! </h2>
                    <img className="landing-pic" src={bg} ></img>
                </div>
            ) : (
                <div className='public-home' >
                    <div className='public-greeting'>Welcome to SonicCloud! </div>
                    <div className='public-greeting'>Join us to discover more  or <NavLink className='home-signup' to='/signup' >Sign Up Now</NavLink> </div>
                    <img className="landing-pic" src={bg}></img>
                </div>

            )}
            <div className='carousel_container'>
            <Carousel items={items}/>
            </div>
            {/* <div className="all-home-song-container">
                {allsongs && allsongs.map((song) => {
                    return <div className="eachhomesong" key={song.id}>
                        <img src={song.previewImage} ></img>
                        <button className="home-songplay-button" value={song.url} onClick={e => handleHomePlay(e, song)} >{(songSelect === song?.id) ? '||' : '▶'}</button>
                        <div className='home-song-title'>
                            <NavLink to={`/songs/${song.id}`}>{song.title}</NavLink>
                        </div>

                    </div>
                })}

            </div> */}

        </div>

    )
}

export default TestUserHome;
