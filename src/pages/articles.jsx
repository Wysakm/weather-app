import React from 'react';
import './styles-pages/articles.css';
import TravelerContainer from '../components/TravelerContainer';

const Article = () => {
  return (
    <div className="article-container">
      <div className="article-box">
        <h1>Railay Beach</h1> 
        <div className='district-province'>
          <h3>District, </h3>
          <h3> Province</h3>
        </div>

    <div className='tag-container'>
      <div className='tag'>
        Nation Park
      </div>
      <div className='tag'>
        Beach
      </div>
      <div className='tag'>
        Climbing
        </div>
    </div>
    </div>

       <div className='article-box-I'>
        <div className='article-box-I-left'>
          image 
        </div>
        <div className='article-box-I-right'>
       
        </div>
        </div>


        <div className='content-container'>
        
        </div>

        <TravelerContainer />
       
        

      
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