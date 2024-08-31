import React from "react";
// import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Label } from "../Component/label";
import { Input } from '../Component/input';
import { Textarea } from "../Component/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../Component/select";
const NewsAdd = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
    <SideNav />
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
      <HeaderNav />
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>News</CardTitle>
                <CardDescription>Manage your news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter news title" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Enter news content" className="min-h-[200px]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" placeholder="Enter author name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publish-date">Publish Date</Label>
                    <Input id="publish-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select id="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select id="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="featured-image">Featured Image</Label>
                    <div className="flex items-center gap-4">
                      <img
                        src="/placeholder.svg"
                        width={100}
                        height={100}
                        alt="Featured Image"
                        className="rounded-md object-cover"
                        style={{ aspectRatio: "100/100", objectFit: "cover" }}
                      />
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
    </div>
    </div>
);
};

export default NewsAdd;