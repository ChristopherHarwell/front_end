import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';

import { axiosWithAuth } from '../../utils/auth/axiosWithAuth';
import ProgressBar from '../../components/progress-bar/progress-bar';
import Skeleton from '@material-ui/lab/Skeleton';
import { useHistory } from 'react-router-dom';
import NoteIcon from '@material-ui/icons/Note';
import PeopleIcon from '@material-ui/icons/People';
import InfoIcon from '@material-ui/icons/Info';
import { tableIcons } from '../../utils/material-table-icons';

export default function MaterialTableDemo() {
	const [ loading, setLoading ] = useState(true);
	const history = useHistory();

	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Relationship', field: 'relationship_to_HoH', type: 'hidden' },
			{ title: 'First Name', field: 'first_name', type: 'hidden' },
			{ title: 'Last Name', field: 'last_name' },
			{ title: 'Birth Date', field: 'dob', type: 'date' },
			{ title: 'Gender', field: 'gender' },
			{ title: 'Email', field: 'email' },
			{ title: 'Race', field: 'race' },
			{ title: 'Ethnicity', field: 'ethnicity' },
			{ title: 'Income at entry', field: 'income_at_entry', type: 'currency' },
			{ title: 'Income at exit', field: 'income_at_exit', type: 'currency' },
			{ title: 'Exit Destination', field: 'exit_destination' },
			{ title: 'Project Name', field: 'project_name' },
			{ title: 'Pregnancy Due Date', field: 'pregnancy_due_date', type: 'date' },
			{ title: 'When DV Occured', field: 'when_dv_occured', type: 'date' },
			{ title: 'Domestic Violence', field: 'domestic_violence', type: 'boolean' },
			{ title: 'Currently Fleeing', field: 'currently_fleeing', type: 'boolean' },
			{ title: 'Enrollment Status', field: 'school_status' },
			{ title: 'Connected to MVento', field: 'connected_to_MVento', type: 'boolean' }
		],
		data: []
	});

	useEffect(() => {
		setLoading(true);
		axiosWithAuth()
			.get(`/api/guests`)
			.then((res) => {
				const { guests } = res.data.payload;
				setState({
					...state,
					data: guests
				});
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				alert(err.message);
				// history.push('/error-page')
			});
	}, []);

	if (loading) {
		return (
			<div>
				<div className="container-skeleton">
					<Skeleton height={400} />
				</div>
				<ProgressBar />
			</div>
		);
	}

	return (
		<div className="container">
			<MaterialTable
				icons={tableIcons}
				title="Guests"
				columns={state.columns}
				data={state.data}
				actions={[
					{
						icon: InfoIcon,
						tooltip: 'More Info',
						onClick: (event, rowData) => {
							// Do save operation
							history.push(`/guests/${rowData.guest_id}`);
						}
					},
					{
						icon: PeopleIcon,
						tooltip: 'Family Members',
						onClick: (event, rowData) => {
							// Do save operation
							history.push(`/guests/family/${rowData.fam_id}`);
						}
					},
					{
						icon: NoteIcon,
						tooltip: 'Notes',
						onClick: (event, rowData) => {
							// Do save operation
						}
					}
				]}
				editable={{
					// onRowRedirect: (newData) =>
					//     new Promise((resolve) => {
					//         setTimeout(() => {
					//             resolve();
					//             setState((prevState) => {
					//                 const data = [...prevState.data];
					//                 data.push(newData);
					//                 return { ...prevState, data };
					//             });
					//         }, 600);
					//     }),
					onRowUpdate: (newMemberData, oldData) =>
						new Promise((resolve) => {
							axiosWithAuth()
								.patch(`/api/guests/family/${oldData.fam_id}/${oldData.guest_id}`, newMemberData)
								.then((res) => {
									resolve();
									setState((prevState) => {
										const data = [ ...prevState.data ];
										data[data.indexOf(oldData)] = newMemberData;
										return { ...prevState, data };
									});
								})
								.catch((err) => {
									resolve();
									alert('Unable to update user, please try again');
								});
						}),
					onRowDelete: (member) =>
						new Promise((resolve) => {
							axiosWithAuth()
								.delete(`/api/guests/family/${member.fam_id}/${member.guest_id}`)
								.then((res) => {
									resolve();
									setState((prevState) => {
										const data = [ ...prevState.data ];
										data.splice(data.indexOf(member), 1);
										return { ...prevState, data };
									});
								})
								.catch((err) => {
									resolve();
									console.log(err);
									alert('Unable to delete user, please try again');
								});
						})
				}}
			/>
			{loading && <ProgressBar />}
		</div>
	);
}
