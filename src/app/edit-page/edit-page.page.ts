import { Component, OnInit } from "@angular/core";
import { Post } from "../models/post.model";
import { ActivatedRoute } from "@angular/router";
import {
    LoadingController,
    ToastController,
    NavController,
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
    selector: "app-edit-page",
    templateUrl: "./edit-page.page.html",
    styleUrls: ["./edit-page.page.scss"],
})
export class EditPagePage implements OnInit {
    post = {} as Post;
    id: any;

    constructor(
        private actRouter: ActivatedRoute,
        private loadingCtrl: LoadingController,
        private firestore: AngularFirestore,
        private toastCtrl: ToastController,
        private navCtrl: NavController,
    ) {
        this.id = this.actRouter.snapshot.paramMap.get("id");
    }

    ngOnInit() {
        this.getPostById(this.id);
    }

    async getPostById(id: string) {
        let loader = this.loadingCtrl.create({
            message: "Please wait...",
        });
        (await loader).present();

        this.firestore
            .doc(`post/${id}`)
            .valueChanges()
            .subscribe((data) => {
                this.post.title = data["title"];
                this.post.details = data["details"];
            });

        (await loader).dismiss();
    }

    async updatePost(post: Post) {
        if (this.formValidation()) {
            let loader = this.loadingCtrl.create({
                message: "Please wait...",
            });
            (await loader).present();

            try {
                console.log(post);
                await this.firestore.doc(`post/${this.id}`).update(post);
            } catch (e) {
                this.showToast(e);
            }
            (await loader).dismiss();
            this.navCtrl.navigateBack("home");
        }
    }

    formValidation() {
        if (!this.post.title) {
            this.showToast("Enter Title");
            return false;
        }
        if (!this.post.details) {
            this.showToast("Enter Details");
            return false;
        }

        return true;
    }

    showToast(message: string) {
        this.toastCtrl
            .create({
                message: message,
                duration: 3000,
            })
            .then((toastDate) => toastDate.present());
    }
}
