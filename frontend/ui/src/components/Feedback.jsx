// const [myFeedbacks, setMyFeedbacks] = useState([]);

// useEffect(() => {
//     const fetchMyFeedbacks = async () => {
//         try {
//             const res = await api.get('/api/feedback/my-feedbacks');
//             if (res.data.status === 'Success') {
//                 setMyFeedbacks(res.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching profile feedback:", err);
//         }
//     };
//     fetchMyFeedbacks();
// }, []);