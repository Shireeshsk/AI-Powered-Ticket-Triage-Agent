export const saveTicket = async (data) => {
  try {
    const response = await fetch('http://localhost:5000/api/ticket/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const resData = await response.json();
      console.log("Data saved successfully")
      return resData.ticket;
    }
    console.log("Failed to Save Ticket in DataBase")
  } catch (err) {
    console.log(err);
    console.log("Failed to Save Ticket in DataBase")
  }
};