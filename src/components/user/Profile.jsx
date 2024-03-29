import { useEffect } from 'react'
import avatar from '../../assets/img/user.png'
import { useState } from 'react'
import { GetProfile } from '../../helpers/GetProfile'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import UseAuth from '../../hooks/UseAuth'
import { PublicationList } from '../publication/PublicationList'


export const Profile = () => {
    const [user, setUser] = useState({})
    const { auth } = UseAuth()
    const [counters, setCounters] = useState({})
    const [iFollow, setIFollow] = useState(false)
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(true)
    const token = localStorage.getItem('token')

    const params = useParams()

    useEffect(() => {
        getDataUser()
        getCounters(params.userId, setCounters)
        getPublications(1, true)
    }, [])

    useEffect(() => {
        getDataUser()
        getCounters(params.userId, setCounters)
        setMore(true)
        getPublications(1, true)
    }, [params])

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser);

        if (dataUser.following && dataUser.following._id) setIFollow(true)
    }

    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        const data = await request.json()

        if (data.following) {
            setCounters(data)

        }

    }
    const follow = async (userId) => {

        const response = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        const data = await response.json();

        if (data.status === 'success') {
            // Actualizar estado
            setIFollow(true)
        }

    };

    const unfollow = async (userId) => {

        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        const data = await request.json()

        if (data.status == "success") {
            setIFollow(false)
        }

    };

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const data = await request.json()

        if (data.status === "success") {
            let newPublications = data.publications

            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications]
            }
            if (newProfile) {
                newPublications = data.publications
                setMore(true)
                setPage(1)
            }

            setPublications(newPublications)

            if (!newProfile && publications.length >= data.total - data.publications.length) {
                setMore(false)
            }
        }
    }

    
    

    return (
        <>
            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />}
                        {user.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{user.name} {user.surname}</h1>

                            {user._id !== auth._id &&
                                (iFollow ?
                                    <button onClick={() => unfollow(user._id)} className="content__button content__button--rigth post__button">Dejar de Seguir</button>
                                    :
                                    <button onClick={() => follow(user._id)} className="content__button content__button--rigth">Seguir</button>
                                )
                            }
                        </div>
                        <h2 className="container-names__nickname">{user.nck}</h2>
                        <p>{user.bio}</p>

                    </div>

                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/siguiendo/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/seguidores/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>


                </div>
            </header >

            <PublicationList
                
                publications={publications}
                getPublications={getPublications}
                getDataUser={getDataUser}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                
            />
            
            <br />
        </>
    )
}
