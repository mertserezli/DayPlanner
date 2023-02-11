import React, {useState} from "react";

function Description(props){
    const saveDescription = props.saveDescription;
    const item = props.item;
    const [description, setDescription] = useState(item.description);

    function handleSaveDescription(){
        saveDescription(description)
    }

    return(<>
            <div style={{display: "flex", flexDirection: "column", textAlign:"center", justifyContent: "center", top:"50%", left:"50%", width:"50%", transform:"translate(50%, 15%)", height: "75%"}}>
                <textarea style={{height:"100%", width:"100%"}} value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={handleSaveDescription}>Save</button>
            </div>
        </>
    )
}

export default Description