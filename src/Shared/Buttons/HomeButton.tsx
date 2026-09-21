import { OFIcon } from '../Icons/OFIcon';
import IconButton from '@mui/material/IconButton';
import  '../../Styles/Components/Buttons.css';

export const HomeButton = () => {
    return (
        <IconButton color="inherit" className="OMIX-home-button">
            <OFIcon />
        </IconButton>
    )
}