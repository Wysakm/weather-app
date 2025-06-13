import React, { useState, useEffect } from 'react';
import './styles-pages/articles.css';
import TravelerContainer from '../components/TravelerContainer';
import WeatherArticle from '../components/WeatherArticle';
import WeeklyArticle from '../components/WeeklyArticle';
import AirQualityArticle from '../components/AirQualityArticle';
import { useParams } from 'react-router-dom';
import { postsAPI } from '../api/posts';

const Article = () => {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = (await postsAPI.getById(postId)).data;
        console.log('Post data:', data);
        console.log('Place coordinates:', {
          latitude: data?.place?.latitude,
          longitude: data?.place?.longitude
        });
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return <div className="article-container">Loading...</div>;
  }

  if (error) {
    return <div className="article-container">Error: {error}</div>;
  }

  return (
    <div className="article-container">
      <div className="article-box">
        <h1>{post?.title || 'Loading...'}</h1>
        <div className='district-province'>
          <h3>{post?.place?.district?.name || 'District'}, </h3>
          <h3> {post?.place?.province?.name || 'Province'}</h3>
        </div>

        <div className='tag-container'>
          <div className='tag'>{post.place.place_type.type_name}</div>
        </div>
      </div>

      <div className='article-box-I'>
        <div className='article-box-I-left'>
          {post?.image ? (
            <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }} src={post.image} alt={post.title} />
          ) : (
            'image'
          )}
        </div>
        <div className='article-box-I-right'>
          <WeatherArticle
            latitude={post?.place?.latitude}
            longitude={post?.place?.longitude}
            provinceName={post?.place?.province?.name}
          />
          <WeeklyArticle
            latitude={post?.place?.latitude}
            longitude={post?.place?.longitude}
          />
          <AirQualityArticle
            latitude={post?.place?.latitude}
            longitude={post?.place?.longitude}
          />
        </div>
      </div>

      <div className='content-container'>
        {/* <p>{post?.body || 'Loading content...'}</p> */}
        <div
          style={{
            borderRadius: '6px',
            padding: '16px',
            backgroundColor: 'var(--color-navbar-bg)',
            minHeight: '100px',
            width: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: post?.body }}
        />
      </div>

      <TravelerContainer id_place={post?.id_place} id_post={postId} />
    </div>
  );
};
export default Article;
// import React, { useState, useEffect } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import './styles-pages/articles.css';

// const Article = () => {
//   const { id } = useParams();
//   const [articleType, setArticleType] = useState('');
//   const [article, setArticle] = useState({
//     title: '',
//     content: '',
//     images: [],
//     location: '',
//     price: '',
//     contact: ''
//   });
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//  const type = queryParams.get('type');
//   // useEffect(() => {

//   // }, [id]);

//   const getTitle = () => {
//     switch (type) {
//       case 'places':
//         return 'สถานที่ท่องเที่ยว';
//       case 'stay':
//         return 'เพิ่มที่พัก';
//       case 'camp':
//         return 'เพิ่มแคมป์';
//       default:
//         return 'เพิ่มบทความ';
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = {
//       ...article,
//       type: articleType,
//       id: id,
//       createdAt: new Date().toISOString()
//     };
//     console.log('Submitting:', data);
//     // TODO: Implement API call
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setArticle(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }));
//   };

//   return (
//     <div className="article-container">
//       <h2>{getTitle()}</h2>
//       <form onSubmit={handleSubmit} className="article-form">
//         <div className="form-group">
//           <label>ชื่อสถานที่:</label>
//           <input
//             type="text"
//             value={article.title}
//             onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
//             required
//             placeholder="กรุณาใส่ชื่อสถานที่"
//           />
//         </div>

//         <div className="form-group">
//           <label>ที่อยู่:</label>
//           <input
//             type="text"
//             value={article.location}
//             onChange={(e) => setArticle(prev => ({ ...prev, location: e.target.value }))}
//             required
//             placeholder="กรุณาใส่ที่อยู่"
//           />
//         </div>

//         {(articleType === 'stay' || articleType === 'camp') && (
//           <div className="form-group">
//             <label>ราคา:</label>
//             <input
//               type="text"
//               value={article.price}
//               onChange={(e) => setArticle(prev => ({ ...prev, price: e.target.value }))}
//               placeholder="กรุณาใส่ราคา"
//             />
//           </div>
//         )}

//         <div className="form-group">
//           <label>รายละเอียด:</label>
//           <textarea
//             value={article.content}
//             onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
//             required
//             rows="10"
//             placeholder="กรุณาใส่รายละเอียด"
//           />
//         </div>

//         <div className="form-group">
//           <label>ช่องทางการติดต่อ:</label>
//           <input
//             type="text"
//             value={article.contact}
//             onChange={(e) => setArticle(prev => ({ ...prev, contact: e.target.value }))}
//             placeholder="เบอร์โทร, Line ID, Facebook"
//           />
//         </div>

//         <div className="form-group">
//           <label>รูปภาพ:</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//         </div>

//         <button type="submit" className="submit-button">บันทึก</button>
//       </form>
//     </div>
//   );
// };

// export default Article;