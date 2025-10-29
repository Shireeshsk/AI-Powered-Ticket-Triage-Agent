export const assignTicket = async (data) => {
  try {
    console.log("assigning ticket to assistant")
    const response = await fetch('http://localhost:5000/api/assistant/add-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const resData = await response.json();
      console.log("Ticket Assignement Successful")
      return;
    }
    console.log("Failed to Assign Ticket")
  } catch (err) {
    console.log(err);
    console.log("Failed to Assign Ticket")
  }
};