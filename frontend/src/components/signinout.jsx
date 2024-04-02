import React from "react";
import { SignIn, SignUp } from "./AccountAction";
import "./signinout.css";

function Signing() {
	return (
		<div className="oneRow">
			<SignIn />
			<img src="../../public/pictures/Core.png" alt="Core Logo" />
			<SignUp />
		</div>
	);
};

export { Signing };