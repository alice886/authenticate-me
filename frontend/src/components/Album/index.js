import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, Route, useParams } from "react-router-dom";
import { getAllAlbums } from '../../store/album'

function AllAlbums() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllAlbums())
    }, [dispatch])

    // const currentUser = useSelector(state => state.session.user);
    // console.log('current user --',currentUser)

    const allAlbums = useSelector(state => Object.values(state.album))
    console.log('current user --', allAlbums)

    return (
        <section className="album-container"> ...... all albums on SonicCloud ......
            <div>
                {allAlbums && allAlbums.map((album) => {
                    return <div className="eachalbum" key={album.id}>
                        <img src={album.previewImage} width='150' ></img>
                        <br></br>
                        <NavLink to={`/albums/${album.id}`}>{album.name}</NavLink>
                        <br></br>
                        <p>album: {album.id}  | artist: {album.userId}</p>
                        {/* <img className="albumImage" src={`album.previewImage`} alt={"album Image"} width={50} height={60} > */}
                    </div>
                })}

            </div>
        </section>
    )
}

export default AllAlbums;
