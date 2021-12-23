import { getFirestore, doc, deleteDoc, updateDoc, } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useState } from "react";
import "./Nweet.css";

const Nweet = ({nweetObj, isOwner, userObj}) => {
    const db = getFirestore();
    const [editing, setEditing] = useState(false);
    const [newNweet, setNweNweet] = useState(nweetObj.text);
    const storage = getStorage();
    // Points to the root reference
    const storageRef = ref(storage);
    const imagesRef = ref(storageRef, `${userObj.uid}`); // child reference pointing to 'userObj.uid'

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure to delete this nweet?");
        if(ok) {
            await deleteDoc(doc(db, "nweets", nweetObj.id));
            const spaceRef = ref(imagesRef, nweetObj.name);
            await deleteObject(spaceRef);
        }
    };
    const toggleEditing = () => {
        setEditing((prev) => !prev);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(doc(db, "nweets", nweetObj.id), {text: newNweet});
        setEditing(false);
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweNweet(value);
    };

    return (
      <div className="nweetContainer">
        {editing ? (
          <div>
            <h3 className="nweetUser"># {userObj.displayName}</h3>
            {nweetObj.attachmentUrl && (
              <img
                className="nweetImage"
                src={nweetObj.attachmentUrl}
                alt="img"
              />
            )}
            <form className="nweetEditContainer">
              <textarea
                type="text"
                value={newNweet}
                required
                maxLength={120}
                rows="4"
                onChange={onChange}
                className="nweetEditText"
              />
              <div className="nweetEditBtnContainer">
                <button onClick={toggleEditing} className="nweetEditCancel">Cancel</button>
                <button onClick={onSubmit} className="nweetEditUpdate">
                  <i class="far fa-edit"></i>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h3 className="nweetUser"># {userObj.displayName}</h3>
            <h4 className="nweetText">{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && (
              <img
                className="nweetImage"
                src={nweetObj.attachmentUrl}
                alt="img"
              />
            )}
            {isOwner && (
              <div className="nweetButton">
                <button onClick={onDeleteClick}>
                  <i class="far fa-trash-alt"></i>
                </button>
                <button onClick={toggleEditing}>
                  <i class="far fa-edit"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
};

export default Nweet;