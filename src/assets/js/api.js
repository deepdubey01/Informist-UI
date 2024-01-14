// function getCompaniesName(access_token, searchText) {
    
//     const baseUrl = 'http://172.17.81.34:8080/api/';
//     const endpoint = 'categories/master_company/';
//     const url = `${baseUrl}${endpoint}?name=${searchText}`;

//     const headers = {
//         'Authorization': `Bearer ${access_token}`,
//         'Content-Type': 'application/json',
//     };

//     fetch(url, { headers })
//         .then(response => {

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }


//             return response.json();
//         })
//         .then(data => {

//             console.log('API Response:', data);
//         })
//         .catch(error => {

//             console.error('Fetch error:', error);
//         });
// }