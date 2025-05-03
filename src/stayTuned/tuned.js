// import React, { useState, useEffect } from 'react';
// import styled, { keyframes } from 'styled-components';
// import { FaFacebook, FaLeaf, FaCalendarAlt } from 'react-icons/fa';
// import iLogo from '../img/mobileLogo.svg';

// const gradientAnimation = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// const floatAnimation = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-15px); }
//   100% { transform: translateY(0px); }
// `;

// const Container = styled.div`
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   background: linear-gradient(-45deg, #3a4d39, #4a5e4a, #5c6d5c, #3a4d39);
//   background-size: 400% 400%;
//   animation: ${gradientAnimation} 15s ease infinite;
//   color: #f0f0f0;
//   overflow: hidden;
//   position: relative;
//   padding: 2rem;
// `;

// const Content = styled.div`
//   text-align: center;
//   z-index: 1;
//   max-width: 800px;
//   padding: 3rem;
//   background: rgba(58, 77, 57, 0.7);
//   backdrop-filter: blur(8px);
//   border-radius: 15px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//   border: 1px solid rgba(255, 255, 255, 0.1);
// `;

// const Title = styled.h1`
//   font-size: 3.5rem;
//   margin-bottom: 1rem;
//   color: #e9f5e9;
//   text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
//   font-weight: 700;
// `;

// const Subtitle = styled.p`
//   font-size: 1.3rem;
//   margin-bottom: 2.5rem;
//   color: #d1dbd1;
//   line-height: 1.6;
// `;

// const CountdownContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 1.2rem;
//   margin-bottom: 2.5rem;
// `;

// const CountdownItem = styled.div`
//   background: rgba(233, 245, 233, 0.1);
//   padding: 1.2rem 0.8rem;
//   border-radius: 8px;
//   min-width: 90px;
//   border: 1px solid rgba(233, 245, 233, 0.2);
// `;

// const CountdownValue = styled.div`
//   font-size: 2.2rem;
//   font-weight: bold;
//   color: #e9f5e9;
// `;

// const CountdownLabel = styled.div`
//   font-size: 0.85rem;
//   color: #b8c8b8;
//   text-transform: uppercase;
//   letter-spacing: 1px;
// `;

// const FacebookButton = styled.a`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 1rem;
//   padding: 1.2rem 2.5rem;
//   background-color: #4267B2;
//   color: white;
//   border-radius: 8px;
//   font-size: 1.2rem;
//   font-weight: 600;
//   text-decoration: none;
//   transition: all 0.3s ease;
//   margin: 2rem 0;
//   border: 2px solid rgba(255, 255, 255, 0.3);
  
//   &:hover {
//     background-color: #365899;
//     transform: translateY(-3px);
//     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
//   }
// `;

// const LogoIcon = styled.div`
//   font-size: 4rem;
//   color: rgba(233, 245, 233, 0.3);
//   margin-bottom: 1.5rem;
//   animation: ${floatAnimation} 4s infinite ease-in-out;
// `;

// const StayTunedPage = () => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 7,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });
  
//   // Set your launch date here (YYYY, MM-1, DD, HH, MM, SS)
//   const launchDate = new Date(2023, 11, 31, 0, 0, 0);
  
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date();
//       const difference = launchDate - now;
      
//       if (difference <= 0) {
//         clearInterval(timer);
//         return;
//       }
      
//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
//       setTimeLeft({ days, hours, minutes, seconds });
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, []);
  
//   return (
//     <Container>
//       <Content>
//         <LogoIcon>
//           <img src={iLogo} alt='' width="150px"/>
//         </LogoIcon>
        
//         <Title>قريباً إن شاء الله</Title>
//         <Subtitle>
//           نحن نعمل على شيء مميز لك. تابع صفحتنا على فيسبوك لتحصل على آخر التحديثات.
//         </Subtitle>
        
//         <CountdownContainer>
//           <CountdownItem>
//             <CountdownValue>{timeLeft.days}</CountdownValue>
//             <CountdownLabel>أيام</CountdownLabel>
//           </CountdownItem>
//           <CountdownItem>
//             <CountdownValue>{timeLeft.hours}</CountdownValue>
//             <CountdownLabel>ساعات</CountdownLabel>
//           </CountdownItem>
//           <CountdownItem>
//             <CountdownValue>{timeLeft.minutes}</CountdownValue>
//             <CountdownLabel>دقائق</CountdownLabel>
//           </CountdownItem>
//           <CountdownItem>
//             <CountdownValue>{timeLeft.seconds}</CountdownValue>
//             <CountdownLabel>ثواني</CountdownLabel>
//           </CountdownItem>
//         </CountdownContainer>
        
//         <FacebookButton 
//           href="https://www.facebook.com/profile.php?id=100063776365288" 
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FaFacebook /> تابعنا على فيسبوك
//         </FacebookButton>
        
//         <div style={{ marginTop: '2rem', color: '#b8c8b8' }}>
//           <FaCalendarAlt /> تاريخ الإطلاق: 31 ديسمبر 2023
//         </div>
//       </Content>
//     </Container>
//   );
// };

// export default StayTunedPage;




import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFacebook, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import iLogo from '../img/mobileLogo.svg';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #3a4d39, #4a5e4a, #5c6d5c, #3a4d39);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: #f0f0f0;
  overflow: hidden;
  position: relative;
`;

const Content = styled.div`
  text-align: center;
  z-index: 1;
  max-width: 800px;
  padding: 3rem;
  background: rgba(58, 77, 57, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #e9f5e9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: #d1dbd1;
  line-height: 1.6;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
`;

const CountdownItem = styled.div`
  background: rgba(233, 245, 233, 0.1);
  padding: 1.2rem 0.8rem;
  border-radius: 8px;
  min-width: 90px;
  border: 1px solid rgba(233, 245, 233, 0.2);
`;

const CountdownValue = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  color: #e9f5e9;
`;

const CountdownLabel = styled.div`
  font-size: 0.85rem;
  color: #b8c8b8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FacebookButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.2rem 2.5rem;
  background-color: #4267B2;
  color: white;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 2rem 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background-color: #365899;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const LogoIcon = styled.div`
  margin-bottom: 1.5rem;
  animation: ${floatAnimation} 4s infinite ease-in-out;
  img {
    width: 150px;
    height: auto;
  }
`;

const TeamContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(233, 245, 233, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(233, 245, 233, 0.2);
  direction: rtl;
`;

const TeamTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #e9f5e9;
  margin-bottom: 1rem;
`;

const TeamMembers = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const TeamMember = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.95rem;
  color: #d1dbd1;
  transition: all 0.3s ease;
  cursor: pointer ;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
`;

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('ar-EG', options);
};

const StayTunedPage = () => {
  // تاريخ الإطلاق: 31 ديسمبر 2023
  const launchDate = new Date(2025, 4, 8, 0, 0, 0);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;
      
      if (difference <= 0) {
        setIsLaunched(true);
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Container>
      <Content>
        <LogoIcon>
          <img src={iLogo} alt='شعار المتجر' width="150px"/>
        </LogoIcon>
        
        <Title>قريباً إن شاء الله</Title>
        <Subtitle>
          نحن نعمل على شيء مميز لك. تابع صفحتنا على فيسبوك لتحصل على آخر التحديثات.
        </Subtitle>
        
        {isLaunched ? (
          <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#e9f5e9' }}>
            لقد تم الإطلاق! زورونا الآن
          </div>
        ) : (
          <CountdownContainer>
            <CountdownItem>
              <CountdownValue>{timeLeft.days}</CountdownValue>
              <CountdownLabel>أيام</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownValue>{timeLeft.hours}</CountdownValue>
              <CountdownLabel>ساعات</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownValue>{timeLeft.minutes}</CountdownValue>
              <CountdownLabel>دقائق</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownValue>{timeLeft.seconds}</CountdownValue>
              <CountdownLabel>ثواني</CountdownLabel>
            </CountdownItem>
          </CountdownContainer>
        )}
        
        <FacebookButton 
          href="https://www.facebook.com/profile.php?id=100063776365288" 
          target="_blank"
          rel="noopener noreferrer"
          style={{direction: 'rtl'}}
        >
          <FaFacebook /> تابعنا على فيسبوك
        </FacebookButton>
        
        <div style={{ marginTop: '2rem', color: '#b8c8b8', direction:'rtl' }}>
          <FaCalendarAlt /> تاريخ الإطلاق: {formatDate(launchDate)}
        </div>

        <TeamContainer>
          <TeamTitle>
            <FaUsers /> فريق العمل
          </TeamTitle>
          <TeamMembers>
            <TeamMember>عبدالرحمن عبدالسميع</TeamMember>
            <TeamMember>محمد محمود حامد</TeamMember>
            <TeamMember>محمد عبدالحميد</TeamMember>
          </TeamMembers>
        </TeamContainer>
      </Content>
    </Container>
  );
};

export default StayTunedPage;