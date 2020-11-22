import firebase from 'firebase/app';
import 'firebase/firestore';

import React, {useState} from "react";

const firestore = firebase.firestore();

function Description(props){
    const item = props.item;
    const [description, setDescription] = useState(item.description);

    const query = firestore.collection('Todo');

    const save = async ()=>{
        query.doc(item.id).update({description:description})
    };

    return(<>
            <div style={{display: "flex", flexDirection: "column", textAlign:"center", justifyContent: "center", top:"50%", left:"50%", width:"50%", transform:"translate(50%, 15%)", height: "75%"}}>
                <textarea style={{height:"100%", width:"100%"}} value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={()=>save()}>Save</button>
            </div>
        </>
    )
}

export default Description