import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Chip, Typography, Grid } from '@mui/material';
import { CodeBlock, dracula } from 'react-code-blocks';

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
	definitionLinkText: string;
}
export default function EventComponent(props: PropsTest) {
	const formattedMessage = JSON.stringify(JSON.parse(props.message), null, 4);
	return (
		<Item style={{width:"100%"}}>
      <Typography gutterBottom variant="h5">
        Message was send on channel: <b>{props.channel}</b>
      </Typography>
      
      <Grid item xs={12} margin={4}>
				With the following parameters: 
				{props.params.map((param: any) => (
					<Chip key="test" size="small" variant="outlined" color="warning" label={`{${param.name}}: ${param.value}`} style={{margin: "0 5px"}}/>
				))}
      </Grid>
			<Grid container style={{backgroundColor: 'rgb(45 55 72)'}}>
				<Grid item xs={12}>
					<Typography color="white" variant='h5'>
						Message received with payload
					</Typography>
					<Typography color="white" variant="caption">
						Message definition: <a href={props.definitionLink} style={{color: "inherit"}}>{props.definitionLinkText}</a>
					</Typography>
          
					<Typography style={{textAlign: 'left'}} fontWeight={400} fontFamily={"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace"}>
            <CodeBlock
                text={formattedMessage}
                language={"json"}
                showLineNumbers={false}
                theme={dracula}
                wrapLines={true}
                codeBlock
              />
					</Typography>
				</Grid>
			</Grid>
		</Item>
	);
}
  