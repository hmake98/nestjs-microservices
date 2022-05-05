export interface IGoogleUserInfo {
  id: string; //sub - the unique identifier
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [
    {
      value: string;
      verified: true;
    },
  ];
  photos: [{ value: string }];
  provider: string | 'google';
}
