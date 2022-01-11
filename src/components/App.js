import { Card, Form } from "react-bootstrap";
import CurrencyControl from "./CurrencyControl";

function App() {
	return (
		<Card border="primary" style={{ width: '600px' }}>
			<Card.Body className='justify-content-center' style={{ width: '550px' }}>
				<Form>
					<Form.Group>
						<Form.Label>Example 1</Form.Label>
						<Form.Control />
					</Form.Group>
					<Form.Group>
						<Form.Label>Amount</Form.Label>
						<CurrencyControl />
					</Form.Group>
					<Form.Group>
						<Form.Label>ATM Amount</Form.Label>
						<CurrencyControl atmMode={true}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Example 2</Form.Label>
						<Form.Control />
					</Form.Group>
				</Form>
			</Card.Body>
		</Card>
	);
};

export default App;
