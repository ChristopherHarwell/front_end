import React from 'react';
import AppCard from './card/Card';

import './apps-page.scss';
import { useHistory } from 'react-router-dom';
import dashboardImg from '../../assets/svg/analyse.png';
import registerFamilyImg from '../../assets/svg/support.png';
import placeHolder from '../../assets/svg/Astronaut.png';
const AppsPage = () => {
	const history = useHistory();
	return (
		<div className="container">
			<div className="apps-container">
				<div onClick={() => history.push('/register-family')}>
					<AppCard title={'Register Family'} img={registerFamilyImg}>
						place
					</AppCard>
				</div>
				<div onClick={() => history.push('/dashboard')}>
					<AppCard title={'Dashboard'} img={dashboardImg}>
						place
					</AppCard>
				</div>
				<div>
					<AppCard title={'placeholder'} img={placeHolder}>
						place
					</AppCard>
				</div>
			</div>
		</div>
	);
};

export default AppsPage;
