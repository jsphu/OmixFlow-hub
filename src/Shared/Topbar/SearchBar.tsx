import InputBase from '@mui/material/InputBase';
import { SearchButton } from '../Buttons/SearchButton';

export const SearchBar = () => {
    return (
        <>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
            />
            <SearchButton />
        </>
    )
}