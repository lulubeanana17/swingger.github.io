import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, } from "firebase/storage";
import Nweet from "../components/Nweet";
import "./Home.css";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const refInput = useRef();
    const db = getFirestore();
    const storage = getStorage();
    // Points to the root reference
    const storageRef = ref(storage);
    const imagesRef = ref(storageRef, `${userObj.uid}`); // child reference pointing to 'userObj.uid'
    const [toggle, setToggle] = useState(0);

    useEffect(() => {
      const q = query(collection(db, "nweets"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
          const nweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async(event) => {
        event.preventDefault();
        let attachmentUrl = "";
        let fileName = "";

        if(attachment !== "") {
          fileName = `${Date.now()}`;
          const spaceRef = ref(imagesRef, fileName);

          const messageURL = `${attachment}`;
          await uploadString(spaceRef, messageURL, 'data_url');
          attachmentUrl = await getDownloadURL(spaceRef);
        }
      
        await addDoc(collection(db, "nweets"), {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
            name: fileName
        });
        setNweet("");
        onClearAttachment();
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result)
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => {
        setAttachment("");
        refInput.current.value = "";
    };
    const onToggle = () => {
      if(toggle === 0) {
        setToggle(1);
      } else {
        setToggle(0);
      }
    };

    return (
      <div className="container">
        <div className="hiddenContainer">
          <div className="hiddenMenu" onClick={onToggle} style={{transform: toggle === 0? "rotate(0)" : "rotate(45deg)"}}>
            <div className="hiddenMenu1" style={{transform: "translateY(8px)"}}></div>
            <div className="hiddenMenu3" style={{transform: "rotate(90deg) translateX(-8px)"}}></div>
          </div>
        </div>
        <form className="form" style={{marginTop: toggle === 0? "-250px" : "50px"}}>
          <textarea
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
            rows="4"
            className="inputText"
          />
          <label for="inputFileChosen" className="custom-file-upload">
          <i class="far fa-images"></i>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            ref={refInput}
            id="inputFileChosen"
            className="inputFileChosen"
          />
          <div className="attachmentContainer">
          {attachment && (
            <div className="attachmentInsideContainer">
              <img
                src={attachment}
                alt="exampleimage"
                className="attachmentImage"
              />
              <button onClick={onClearAttachment} className="attachmentButton">Clear</button>
            </div>
          )}
          </div>
          <button onClick={onSubmit} className="inputSubmit"><i class="fas fa-paper-plane"></i></button>
        </form>
        <div className="nweets">
          {nweets.map((nweet, key) => (
            <Nweet
              key={key}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
              userObj={userObj}
            />
          ))}
        </div>
      </div>
    );
};

export default Home;