import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { Container } from 'common/components';
import { LoadCountries } from 'common/types';
import { useTrip } from 'modules/createTrip/context';
import { useCallback } from 'react';

export const DestinationStep = () => {
    const { trip, setDestination } = useTrip();

    const handleOnChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            setDestination(event.target.value);
        },
        [setDestination]
    );

    return (
        <Container>
            <Typography variant="h5">Please select your destination</Typography>
            <FormControl style={{ width: '20rem', margin: '30px' }}>
                <InputLabel>Select a country</InputLabel>
                <Select
                    label="Select a country"
                    value={trip.destination}
                    onChange={handleOnChange}
                >
                    {LoadCountries().map((c) => (
                        <MenuItem value={c.name} key={c.name}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
};
