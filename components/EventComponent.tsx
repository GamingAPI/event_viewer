import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Chip, Typography } from '@mui/material';
import Face2Outlined from '@mui/icons-material/Face2Outlined';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type PropsTest = {
	message: string;
	channel: string;
	params: any[];
	definitionLink: string;
}
export default function EventComponent(props: PropsTest) {
	return (
		<Item style={{width:"100%"}}>
			<Typography color="text.secondary" variant="body2">
				Message received with payload: {props.message}.
			</Typography>
			<Typography gutterBottom variant="body1">
				Event was {props.channel}. 
			</Typography>
			<Stack direction="row" spacing={1}>
				With the following parameters: 
				{props.params.map((param: any) => (
					<Chip key="test" size="small" variant="outlined" color="warning" label={param.name + ": "+ param.value} />
				))}
			</Stack>
		</Item>
	);
}
  