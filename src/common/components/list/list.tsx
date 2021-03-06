import { HighlightOff } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Entries } from 'common/types';
import { Entry } from 'common/types/misc';

import * as SC from './list.style';

export type LayoutProps = {
    title: string;
    entries: Entries[];
    verticle?: boolean;
    removeOnClick?: (id: number) => void;
};

export const List = ({
    title,
    entries,
    verticle,
    removeOnClick,
}: LayoutProps) => {
    const removeOnClickForEntry = (entry: Entry) => () => {
        if (removeOnClick) {
            removeOnClick(entry.id);
        }
    };

    return (
        <div
            style={{
                textAlign: 'center',
                maxHeight: '40vh',
                overflow: 'auto',
            }}
        >
            <SC.ListTitle>{title}</SC.ListTitle>
            {entries.map((entry) => (
                <SC.ListContainer
                    verticle={verticle}
                    key={`${entry[0].header}-${entry[0].id}`}
                >
                    {entry.map((subEntry) => (
                        <SC.SubListContainer
                            key={`${subEntry.header}-${subEntry.id}`}
                        >
                            <Typography
                                key={`${subEntry.header}-${subEntry.id}`}
                                style={{ fontWeight: 'bold' }}
                            >
                                {subEntry.header}
                            </Typography>

                            <Typography
                                key={`${subEntry.content}-${subEntry.id}`}
                            >
                                {subEntry.content}
                            </Typography>

                            {removeOnClick && (
                                <SC.RemoveButton
                                    onClick={removeOnClickForEntry(subEntry)}
                                >
                                    <HighlightOff />
                                </SC.RemoveButton>
                            )}
                        </SC.SubListContainer>
                    ))}
                </SC.ListContainer>
            ))}
        </div>
    );
};
