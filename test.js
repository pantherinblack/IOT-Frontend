console.log("DIego")
fetch('http://80.208.228.90:8080/record/list', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },})
    .then((response) => response.json())
    .then(recordList => {
        for (let record of recordList) {
            console.log(record.recordUUID)
        }
    });
