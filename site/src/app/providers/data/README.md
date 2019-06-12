# **KHC Data Provider**

## **Usage**

##### component.ts

```
@Component({
	...
})
export class Component {

	public articles = this.dataService.articles();

	constructor(
		private dataService: DataService
	) { }
}

```

##### component.html

```
<div *ngFor="let article of articles | async">
	<img src="article.imageUrl">
	<h1>{{ article.title }}</h1>
	<markdown [data]="article.content"></markdown>
</div>
```

**NOTE:** ngx-mardown must be installed to display Markdown strings. 
More info: https://www.npmjs.com/package/ngx-markdown 

#

## **Methods**


### **.members**(): Observable\<Member[]>

Returns an observable of an array of all members.


```ts
Member {
	id: string;
	name: string;
	title: string;
	description: string; // Markdown
	image: DocumentReference[];
	imageUrl: string;
}
```

## Happy coding! 