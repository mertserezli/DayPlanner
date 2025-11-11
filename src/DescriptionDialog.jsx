import React, {useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";

function DescriptionDialog({saveDescription, item, open, onClose}){
    const [description, setDescription] = useState(item.description);

    function handleSaveDescription(){
        saveDescription(description)
    }

    function handleClose() {
        onClose();
        setDescription(item.description);
    }

    return(
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Description</DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    minRows={6}
                    fullWidth
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write details about this to-do..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleSaveDescription} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DescriptionDialog