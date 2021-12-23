import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth, signOut,} from "firebase/auth";
import Nweet from "../components/Nweet";
import "./Profile.css";
import Menu from "./Menu";

const Profile = ({userObj}) => {
    const auth = getAuth();
    const redirect = useNavigate();
    const db = getFirestore();
    let arrayQ = [];
    const [array, setArray] = useState([]);
    const menuScroll = Menu(0);

    const onLogOutClick = async() => {
        await signOut(auth).then(() => {
            redirect("/");
        }).catch((error) => {
            alert(error.message);
        });
    };
    const getMyNweets = async() => {
        const q = query(collection(db, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const array1 = new Array({id: doc.id, ...doc.data()});
            arrayQ = [...arrayQ, ...array1];
        });
        setArray(arrayQ);
    };

    useEffect(() => {
        getMyNweets();
        onSnapshot(collection(db, "nweets"), (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setArray(nweetArray);
          });
    }, []);

    return (
      <div className="profileContainer">
        <div className="profileSignContainer" style={{marginTop: menuScroll === 0? "0" : "-80px"}}>
          <button onClick={onLogOutClick} className="profileSignButton">Log Out</button>
          <h3 className="profileSignTitle">My Swinggers</h3>
        </div>
        <div className="nweets">
            <div className="sensor"></div>
          {array.map((nweet, key) => (
            <Nweet
              key={key}
              nweetObj={nweet}
              isOwner={true}
              userObj={userObj}
            />
          ))}
        </div>
      </div>
    );
};

export default Profile;