import {useLoaderData, useParams} from "react-router-dom";
import React, {Suspense, useEffect, useRef, useState} from "react";
import {getPostByChannelName, getUsernameFromSessionStore} from "../../utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {FollowIcon, DontFollow} from "../../components/assets/index.jsx";
import {Button, Spinner} from "flowbite-react";
import RequestModal from "./modals/RequestModal.jsx";
import FollowersModal from "./modals/FollowersModal.jsx";
import AddAdminModal from "./modals/AddAdminModal.jsx";
import RmAdminModal from "./modals/RmAdminModal.jsx";

function SinglePageChannel() {
    const {nome} = useParams();

    const [type, setType] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showAddAdminModal, setShowAddAdimnModal] = useState(false);
    const [showRmAdminModal, setShowRmAdminModal] = useState(false);

    const [hasUpdatedReq, setHasUpdatedReq] = useState(false);
    const [hasUpdatedFol, setHasUpdatedFol] = useState(false);
    const [hasUpdatedAddAdm, setHasUpdatedAddAdm] = useState(false);
    const [hasUpdatedRmAdm, setHasUpdatedRmAdm] = useState(false);

    const [requests, setRequests] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [admins, setAdmins] = useState([]);

    const canSeePosts = useRef(false);

    const handleFollow = () => {
        fetch(`/db/channel/follower`, {
            method:"POST",
            body: JSON.stringify({
                user: getUsernameFromSessionStore(),
                channel: nome
            }),
            headers: {
            "Content-Type":"application/json"
        }})
            .then((res)=> {
                if (res.ok) {
                    location.reload();
                }
            })
    }

    const fetchData = async () => {
        let res = await fetch(`/db/channel/${nome}`);
        res = await res.json();
        setDescription(res.description)
        setRole(res.role);
        canSeePosts.current = (res.role !== "Not Follower" || res.role !== "Pending");
        setFollowers(res.followers.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
        setAdmins(res.admins.sort())
        setType(res.type);
        setRequests(res.requests)
        setHasUpdatedReq(false);
        setHasUpdatedFol(false);
        setHasUpdatedAddAdm(false);
        setHasUpdatedRmAdm(false);
        if (canSeePosts) {
            const resPost = await getPostByChannelName(nome);
            setPosts(resPost);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
            .catch(console.error)
    }, [hasUpdatedReq, hasUpdatedFol, hasUpdatedAddAdm, hasUpdatedRmAdm]);

    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
                ) : (
                <div className="flex flex-col w-full justify-center items-center gap-4">
                    <h3 className="text-center text-2xl font-extrabold mt-4">§{nome}</h3>
                    <p className="w-full h-fit p-2 break-words">{description}</p>
                    {role === "Creator" || role === "Admin" ? (
                            <div className="flex flex-wrap justify-between items-center gap-4 px-8 w-full">
                                <Button
                                    onClick={()=>setShowFollowerModal(true)}
                                >
                                    Gestisci follower
                                </Button>
                                <FollowersModal
                                        channelName={nome} followers={followers} isOpen={showFollowerModal} setIsOpen={setShowFollowerModal}
                                        hasUpdated={hasUpdatedFol} setHasUpdated={setHasUpdatedFol}
                                />
                                {type === "private" &&
                                    <>
                                        <Button
                                            onClick={()=>setShowRequestModal(true)}
                                        >
                                            Gestisci richieste
                                        </Button>
                                        <RequestModal
                                            channelName={nome} requests={requests} isOpen={showRequestModal} setIsOpen={setShowRequestModal}
                                            hasUpdated={hasUpdatedReq} setHasUpdated={setHasUpdatedReq}
                                        />
                                    </>
                                }
                                {role === "Creator" &&
                                    <>
                                        <Button
                                            onClick={()=>setShowAddAdimnModal(true)}
                                        >
                                            Aggiungi admin
                                        </Button>
                                        <AddAdminModal
                                            channelName={nome} followers={followers} isOpen={showAddAdminModal} setIsOpen={setShowAddAdimnModal}
                                            hasUpdated={hasUpdatedAddAdm} setHasUpdated={setHasUpdatedAddAdm}
                                        />

                                        <Button
                                            onClick={()=>setShowRmAdminModal(true)}
                                        >
                                            Rimuovi admin
                                        </Button>
                                        <RmAdminModal
                                            channelName={nome} admins={admins} isOpen={showRmAdminModal} setIsOpen={setShowRmAdminModal}
                                            hasUpdated={hasUpdatedRmAdm} setHasUpdated={setHasUpdatedRmAdm}
                                        />
                                    </>
                                }
                            </div>
                        ) :
                        <>
                        {role === "Follower" || role === "Writer" ? (
                            <Button  onClick={handleFollow}>
                                {DontFollow}
                                <span className="pl-2">
                                    Disicriviti
                                </span>
                            </Button>
                        ): (role === "Not Follower" ? (
                            <Button  onClick={handleFollow}>
                                {FollowIcon}
                                <span className="pl-2">
                                    Segui
                                </span>
                            </Button>
                        ) : (
                            <Button  onClick={handleFollow}>
                                {DontFollow}
                                <span className="pl-2">
                                    Annulla
                                </span>
                            </Button>
                        ))
                        }
                        </>
                    }
                    <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-full pb-20 mt-4 overflow-y-scroll"}>
                        {type === "private" && (role === "Not Follower" || role === "Pending")? (
                            <div>
                                Non puoi ancora vedere i post
                            </div>
                            ) : (
                                <>
                                    {posts!==null && posts.map((post)=> {
                                        //console.log("id",post._id)
                                        return(
                                                <Post
                                                    key={post._id}
                                                    post={post}
                                                />
                                        )})}
                                    {posts.length===0 &&
                                        <p>Non ci sono ancora post indirizzati al canale {nome}</p>
                                    }
                                </>
                        )}
                        </div>
                </div>
            )}
        </>
    );
}

export default SinglePageChannel;