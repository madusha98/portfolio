"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement form submission
		console.log("Form submitted:", formData);
		alert("Thank you for your message! (Form submission not yet implemented)");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
			<div className="space-y-2">
				<Label htmlFor="name" className="font-mono">
					Name
				</Label>
				<Input
					id="name"
					type="text"
					placeholder="Your name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					required
					className="pixel-border"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email" className="font-mono">
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="your.email@example.com"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					required
					className="pixel-border"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="message" className="font-mono">
					Message
				</Label>
				<Textarea
					id="message"
					placeholder="Your message..."
					rows={5}
					value={formData.message}
					onChange={(e) => setFormData({ ...formData, message: e.target.value })}
					required
					className="pixel-border"
				/>
			</div>

			<Button type="submit" className="pixel-border-accent w-full md:w-auto">
				Send Message
			</Button>
		</form>
	);
}
