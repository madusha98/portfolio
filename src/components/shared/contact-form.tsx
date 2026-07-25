"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import cvData from "@/data/cv.json";

const fieldClass = "rounded-none border-border bg-background font-mono focus-visible:border-accent";

export function ContactForm() {
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });

	// ponytail: mailto hand-off, no backend. Swap for a POST to a form service
	// (or a Cloudflare Worker) if you ever want submissions stored server-side.
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const subject = `Portfolio enquiry from ${formData.name}`;
		const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
		window.location.href = `mailto:${cvData.personal.email}?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div className="space-y-2">
				<Label
					htmlFor="name"
					className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
				>
					Name
				</Label>
				<Input
					id="name"
					type="text"
					placeholder="Your name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					required
					className={fieldClass}
				/>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="email"
					className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
				>
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					required
					className={fieldClass}
				/>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="message"
					className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
				>
					Message
				</Label>
				<Textarea
					id="message"
					placeholder="What's on your mind?"
					rows={5}
					value={formData.message}
					onChange={(e) => setFormData({ ...formData, message: e.target.value })}
					required
					className={fieldClass}
				/>
			</div>

			<Button type="submit" className="key key-accent w-full rounded-none font-mono sm:w-auto">
				Send message
			</Button>
		</form>
	);
}
