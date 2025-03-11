import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a base API slice with your base URL
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  endpoints: (builder) => ({
    // Signup endpoint
    signup: builder.mutation({
      query: (userData: { fullName: string; email: string; password: string }) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    // Signin endpoint
    signin: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Update Profile endpoint
    updateProfile: builder.mutation({
      query: ({ userId, profileData }: { userId: string; profileData: any }) => ({
        url: `/user/${userId}/profile`,
        method: 'PUT',
        body: profileData,
      }),
    }),
    // Add Friend endpoint
    addFriend: builder.mutation({
      query: (data: { userId: string; friendId: string }) => ({
        url: '/friends',
        method: 'POST',
        body: data,
      }),
    }),
    // Get Friends List endpoint
    getFriends: builder.query({
      query: (userId: string) => `/user/${userId}/friends`,
    }),
    getUsersExcluding: builder.query({
        query: (userId: string) => `/users/${userId}/exclude`,
      }),
      getUserById: builder.query({
        query: (id: string) => {
          console.log("Calling API for user:", id);
          return `/user/${id}`;
        },
      }),
      getMessages: builder.query({
        query: (room: string) => `/messages?room=${room}`,
      }),
  sendMessage: builder.mutation({
    query: (messageData: { senderId: string; room: string; content: string; id?: string; type?: string; timestamp?: Date }) => ({
          url: "/messages",
          method: "POST",
          body: messageData,
        }),
      }),
      deleteMessages: builder.mutation({
        query: (msgId: string) => ({
          url: `/messages/${msgId}`,
          method: "DELETE",
        }),
      }),
      deleteUser: builder.mutation({
        query: ({ email, password }: { email: string; password: string }) => ({
          url: "/delete",
          method: "DELETE",
          body: { email,password },
        }),
      }),
      checkFriendStatus: builder.query({
        query: ({ userId, friendId }: { userId: string; friendId: string }) => `/friends/status/${userId}/${friendId}`,
      }),
      
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useUpdateProfileMutation,
  useAddFriendMutation,
  useLazyGetFriendsQuery,
  useLazyGetUsersExcludingQuery,
  useLazyGetUserByIdQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessagesMutation,
  useDeleteUserMutation,
  useLazyCheckFriendStatusQuery
  
  
} = apiSlice;
