import type React from "react";
import { useState } from "react";
import "./App.css";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { Button } from "./ui/button";

// This will set the NUI to visible if we are
// developing in browser
debugData([
	{
		action: "setVisible",
		data: true,
	},
]);

interface ReturnClientDataCompProps {
	data: unknown;
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({
	data,
}) => (
	<>
		<h5>Returned Data:</h5>
		<pre>
			<code>{JSON.stringify(data, null)}</code>
		</pre>
	</>
);

interface ReturnData {
	x: number;
	y: number;
	z: number;
}

const App: React.FC = () => {
	const [clientData, setClientData] = useState<ReturnData | null>(null);

	const handleGetClientData = () => {
		fetchNui<ReturnData>("getClientData")
			.then((retData) => {
				console.log("Got return data from client scripts:");
				console.log(JSON.stringify(retData, null, 2));
				setClientData(retData);
			})
			.catch((e) => {
				console.error("Setting mock data due to error", e);
				setClientData({ x: 500, y: 300, z: 200 });
			});
	};

	return (
		<div className="nui-wrapper">
			<div className="popup-thing">
				<div>
					<h1>This is the NUI Popup!</h1>
					<p>Exit with the escape key</p>
					<Button onClick={handleGetClientData}>Get Client Data</Button>
					{clientData && <ReturnClientDataComp data={clientData} />}
				</div>
			</div>
		</div>
	);
};

export default App;
