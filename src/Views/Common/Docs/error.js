	import React, { Component } from 'react';
	import { Link } from 'react-router-dom';
	import { Image } from 'react-bootstrap'


	class Error extends Component {
		render() {
			return <div className="ltn__404-area ltn__404-area-1 mb-120 page-not-found-component">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="error-404-inner text-center">
								<div className="error-img ">
									<Image src='https://d1olhs2thomfrd.cloudfront.net/pageNotFound.png' width={180} alt="pageNotFound" />
								</div>
								<h1 className="error-404-title d-none">404</h1>
								<h1 style={{ color: '#005C75' }}>Page Not Found!</h1>
								<p>Oops! The page you are looking for does not exist</p>
								<Link to="/">
									<button style={{ backgroundColor: '#005c75d0', color: '#fff' }} className="btn">Back to Home</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		}
	}

	export default Error