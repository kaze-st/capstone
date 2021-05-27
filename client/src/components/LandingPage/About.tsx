import React, { useState } from 'react';

export default function About(): JSX.Element {
	return (
		<>
			<section className="flex-container landing-section">
				<div className="row1">
					<h1>Hao Chen</h1>
					<p>
						Hola, my name is Hao! I am a Spanish with Chinese heritage and
						background. Growing up as an Asian in a mostly Caucasian society has
						taught me a lot about the importance of diversity and inclusion. It
						has also helped me appreciate both cultures that I grew up with. I
						hope to carry both of my cultural identities into my career as a
						software engineer. SSCode has been quite an experience for me, and
						it gave me a chance to tackle a cool problem that not only affected
						me personally, but also many others in my field. I hope you enjoy
						our product!
					</p>
				</div>
				<div className="row2">
					<img className="about-img" alt="Hao Chen" src="./img/hao.png" />
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<img className="about-img" alt="Khoa Luong" src="./img/khoa.png" />
				</div>
				<div className="row2">
					<h1>Khoa Luong</h1>
					<p>
						I am Khoa, and I am an aspiring software engineer. Ever since I was
						a young kid, I have had many chances to travel throughout my home
						country of Vietnam and many others. Over the years I have grown to
						appreciate the world and the diverse cultures it holds. It is for
						that reason that I want to be a part of something that changes
						society for the better. I chose this field because I was impressed
						by the open-sourced nature of this industry, how one person can
						leverage all of the ingenuity of the community to create a new and
						impactful solution for the world. I am also excited of the ubiquity
						of the job in today&apos;s society, meaning whereever I end up, I
						will have an impact. I am having a lot of fun working on SSCode, and
						this has been a great learning experience, one that will have a
						special place in heart throughout my career.
					</p>
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<h1>Nam Pham</h1>
					<p>
						Hello! My name is Nam and I am a back-end dev on SSCode. Like many
						of my teammates, I have background in computer science and aspire to
						be a successful software engineer. Besides that, one of my favorite
						hobbies is teaching others of the verisatility and usefulness of
						computer science and coding. I&apos;d like to think that I have
						helped many find their passion in this field. SSCode is a project
						that I am very invested in. During my time teaching, especially
						during the COVID pandemic, I have found that students have a hard
						time working and asking questions from home. This problem is
						compounded if they have few experience with code beforehand. While I
						try my best to accomodate for everyone, I fear some may shy away
						from the field. To make the field as accessible and diversed as
						possible, I believe there needs to be a better way to collaborate
						outside of Github, which can be daunting for beginners.
					</p>
				</div>
				<div className="row2">
					<img className="about-img" alt="Nam Pham" src="./img/nam.png" />
				</div>
			</section>
			<section className="flex-container landing-section">
				<div className="row1">
					<img className="about-img" alt="Thomas That" src="./img/thomas.png" />
				</div>
				<div className="row2">
					<h1>Thomas That</h1>
					<p>
						Hi, I&apos;m Thomas. I&apos;m a UI/UX Designer dedicated to
						providing users with a smooth and satisfying experience using any
						product I create. I focus heavily on user feedback and make sure
						that I tailor the experience to them as much as possible. Despite
						mainly working in design spaces, I do have some experience in team
						coding and wanted to provide a solution to the issues of coding in
						an online space. My role in this project was designing the UI of the
						website you see here, but also conducting the user research and
						testing so that we could provide you with the product you see now.
					</p>
				</div>
			</section>
		</>
	);
}
