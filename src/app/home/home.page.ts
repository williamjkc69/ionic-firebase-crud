import { Component } from "@angular/core";
import { LoadingController, ToastController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"],
})
export class HomePage {
    constructor(
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private firestore: AngularFirestore,
    ) {}
    posts: any;

    ionViewWillEnter() {
        this.getPost();
    }

    async getPost() {
        let loader = this.loadingCtrl.create({
            message: "Please wait...",
        });
        (await loader).present();

        try {
            this.firestore
                .collection("post")
                .snapshotChanges()
                .subscribe((data) => {
                    this.posts = data.map((e) => {
                        return {
                            id: e.payload.doc.id,
                            title: e.payload.doc.data()["title"],
                            details: e.payload.doc.data()["details"],
                        };
                    });
                });
        } catch (e) {
            this.showToast(e);
        }
        (await loader).dismiss();
    }

    async deletePost(id: string) {
        let loader = this.loadingCtrl.create({
            message: "Please wait...",
        });
        (await loader).present();

        await this.firestore.doc(`post/${id}`).delete();

        (await loader).dismiss();
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
