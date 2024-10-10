export const getRequest = async (url, isAuth, props) => {
    props.setProgress(20);
    let headers = {};
    if (isAuth)
        headers['jwt'] = localStorage.getItem('reel_rivals_token');

    const response = await fetch(url, {
        method: 'GET',
        headers
    });
    const data = await response.json();
    props.setProgress(100);
    return data;
};

export const postRequest = async (url, body, isAuth, props, isFile) => {
    props.setProgress(20);

    let headers = {};
    if (!isFile) {
        headers["content-type"] = "application/json";
    }
    if (isAuth) {
        headers['jwt'] = localStorage.getItem('reel_rivals_token');
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: isFile ? body : JSON.stringify(body)
    });
    const data = await response.json();
    props.setProgress(100);
    return data;

};

export const putRequest = async (url, body, isAuth, props, isFile) => {
    props.setProgress(20);
    let headers = {};

    if (!isFile) {
        headers["content-type"] = "application/json";
    }

    if (isAuth) {
        headers['jwt'] = localStorage.getItem('reel_rivals_token');
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: isFile ? body : JSON.stringify(body)
    });
    const data = await response.json();
    props.setProgress(100);
    return data;
};

export const deleteRequest = async (url, body, isAuth, props) => {
    props.setProgress(20);
    let headers = {};

    if (isAuth)
        headers['jwt'] = localStorage.getItem('reel_rivals_token');

    const response = await fetch(url, {
        method: 'DELETE',
        headers
    });
    const data = await response.json();
    props.setProgress(100);
    return data;
};
