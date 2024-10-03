
---

## Friend System API Documentation

### 1. **Send Friend Request**

#### **Endpoint:**  
`POST /friends/send_request/`

#### **Description:**  
This endpoint allows a user to send a friend request to another user.

#### **Request Body:**
```json
{
  "sender": "sender_username",
  "receiver": "receiver_username"
}
```

#### **Response:**

- **Success (201 Created):**
  ```json
  {
    "message": "Friend request sent!"
  }
  ```
- **Error (400 Bad Request):**
  - If the request was already sent:
    ```json
    {
      "message": "Friend request already sent!"
    }
    ```
  - If the users are already friends:
    ```json
    {
      "message": "You are already friends!"
    }
    ```

---

### 2. **List Received Friend Requests**

#### **Endpoint:**  
`GET /friends/received_requests/?username=username`

#### **Description:**  
This endpoint allows a user to list all received, pending friend requests.

#### **Query Parameters:**
- `username`: The username of the user retrieving received friend requests.

#### **Response:**

- **Success (200 OK):**
  ```json
  {
    "received_requests": [
      {
        "id": request_id,
        "sender": "sender_username"
      }
    ]
  }
  ```
- **Error (404 Not Found):**
  - If the user doesn't exist:
    ```json
    {
      "detail": "Not found."
    }
    ```

---

### 3. **Accept Friend Request**

#### **Endpoint:**  
`POST /friends/accept_request/`

#### **Description:**  
This endpoint allows a user to accept a friend request.

#### **Request Body:**
```json
{
  "request_id": friend_request_id
}
```

#### **Response:**

- **Success (200 OK):**
  ```json
  {
    "message": "Friend request accepted!"
  }
  ```

- **Error (403 Forbidden):**
  - If the current user is not the receiver of the request:
    ```json
    {
      "message": "You do not have permission to accept this friend request!"
    }
    ```
  
- **Error (400 Bad Request):**
  - If the request was already accepted:
    ```json
    {
      "message": "Friend request already accepted!"
    }
    ```

---

### 4. **Reject Friend Request**

#### **Endpoint:**  
`POST /friends/reject_request/`

#### **Description:**  
This endpoint allows a user to reject a friend request.

#### **Request Body:**
```json
{
  "request_id": friend_request_id
}
```

#### **Response:**

- **Success (200 OK):**
  ```json
  {
    "message": "Friend request rejected!"
  }
  ```

---

### 5. **List Friends**

#### **Endpoint:**  
`GET /friends/list/?username=username`

#### **Description:**  
This endpoint allows a user to list all of their current friends.

#### **Query Parameters:**
- `username`: The username of the user retrieving the friend list.

#### **Response:**

- **Success (200 OK):**
  ```json
  {
    "friends": [
      "friend1_username",
      "friend2_username"
    ]
  }
  ```

---

### 6. **Remove Friend**

#### **Endpoint:**  
`POST /friends/remove/`

#### **Description:**  
This endpoint allows a user to remove a friend from their friend list.

#### **Request Body:**
```json
{
  "user": "username_of_requesting_user",
  "friend": "username_of_friend_to_remove"
}
```

#### **Response:**

- **Success (200 OK):**
  ```json
  {
    "message": "Friend removed!"
  }
  ```

---

### Notes:

- Make sure to include proper authentication (if needed) for the user making these requests.
- When testing, ensure that you have users created in the `CustomUser` model to avoid `404 Not Found` errors for nonexistent users.

This documentation provides an organized flow of how to test each functionality in the friend system API, ensuring a smooth integration.