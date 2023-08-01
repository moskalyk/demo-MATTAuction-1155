import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ url }: any) => {
    return (
      <div style={{width: '100%', margin: 'auto', textAlign: 'center'}}>
        <QRCode value={url} width={500} height={500}/>
      </div>
    );
  };
  
  export default QRCodeGenerator;