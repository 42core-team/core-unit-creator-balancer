import React from "react";
import { SignIn, SignUp } from "./AccountAction";
import "./signinout.css";

function Signing() {
	return (
		<div className="oneRow">
			<SignIn />
			<img style={{height: "100px", width: "100px"}} src="https://github.com/42core-team/core-unit-creator-balancer/blob/main/frontend/public/pictures/Core.png" alt="Core Logo" />
			<SignUp />
		</div>
	);
};

export { Signing };