create table user (
  email varchar(90) not null,
  password varchar(64),
  salt varchar(64),
  first_name varchar(45),
  last_name varchar(45),
  date_of_birth datetime,
  primary key (email)
);

create table administrator (
  email varchar(90) not null,
  office_number smallint check (office_number > 0),
  start_time time,
  end_time time,
  primary key (email),
  foreign key(email) references user(email) on delete cascade
);

create table message (
  email varchar(90) not null,
  num integer,
  post_date date,
  post_time time,
  foreign key (email) references user(email) on delete cascade,
  primary key (email,num)
);

create table textmessage (
  email varchar(90) not null,
  num integer,
  content varchar(255),
  foreign key (email,num) references message(email,num) on delete cascade,
  primary key (email,num)
);

create table picturemessage (
  email varchar(90) not null,
  num integer,
  description varchar(50),
  type varchar(5) check (type in ('jpg','jpeg','gif','png','tiff')),
  url varchar(150),
  foreign key (email,num) references message(email,num) on delete cascade,
  primary key (email,num)
);

create table likes (
  liker_email varchar(90) not null,
  poster_email varchar(90) not null,
  post_number integer not null,
  like_timestamp timestamp,
  foreign key (liker_email) references user(email) on delete cascade,
  foreign key (poster_email,post_number) references message(email,num) on delete cascade,
  primary key (liker_email,poster_email,post_number)
);

create table location (
  locationID integer auto_increment not null,
  longitude float(8,4) not null check (longitude > -181 and longitude < 181),
  latitude float(8,4) not null check (latitude > -91 and latitude < 91),
  primary key (locationID)
);

create table located_at (
  post_email varchar(90) not null,
  post_num integer,
  locID integer,
  foreign key (post_email,post_num) references message(email,num) on delete cascade,
  foreign key (locID) references location(locationID) on delete cascade,
  primary key (post_email,post_num)
);

create table admin_phones (
  admin_email varchar(90) not null,
  phone_number varchar(20) not null,
  foreign key (admin_email) references administrator(email) on delete cascade,
  primary key (admin_email,phone_number)
);
