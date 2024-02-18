import { FirebaseApp } from 'firebase/app';
import { Auth, User, UserCredential, getAuth, signInWithCustomToken } from 'firebase/auth';
import { Firestore, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { inject, injectable } from 'inversify';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { FirestoreCollection } from '../../constants/firestore-collection.constants';
import { AppUser } from '../../interfaces/app-user.interface';
import { AppTypes } from '../types';
import { IAuthService } from './auth.types';

@injectable()
export class AuthService implements IAuthService {
  private auth: Auth;
  private firestore: Firestore;
  private usersCache: Record<string, { invalidate: number; data: AppUser }> = {};
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private shareAllUsers$: Observable<AppUser[]>;

  public constructor(@inject(AppTypes.FirebaseApp) firebaseApp: FirebaseApp) {
    this.auth = getAuth(firebaseApp);
    this.firestore = getFirestore(firebaseApp);
    this.auth.onAuthStateChanged((user) => {
      if (!this.ready$.getValue()) {
        this.ready$.next(true);
      }
      this.user$.next(user);
    });
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  public signIn(token: string): Observable<UserCredential> {
    return of(void 0).pipe(switchMap(() => signInWithCustomToken(this.auth, token)));
  }

  public signOut(): Observable<void> {
    return of(void 0).pipe(switchMap(() => this.auth.signOut()));
  }

  public getAllUsers(): Observable<AppUser[]> {
    if (!this.shareAllUsers$) {
      this.shareAllUsers$ = of(void 0).pipe(
        switchMap(() => getDocs(collection(this.firestore, FirestoreCollection.Users))),
        map((snapshot) => snapshot.docs.map((item) => item.data() as AppUser)),
        shareReplay(1),
      );
    }
    return this.shareAllUsers$;
  }

  public getUser(uid: string): Observable<AppUser> {
    console.log(uid);
    return of(void 0).pipe(
      switchMap(() => {
        if (this.usersCache[uid] && this.usersCache[uid].invalidate > Date.now()) {
          return of(this.usersCache[uid].data);
        }
        return from(getDoc(doc(this.firestore, FirestoreCollection.Users, uid))).pipe(
          map((snapshot) => {
            if (!snapshot.exists()) {
              return {
                uid,
                displayName: 'Deleted User',
                photoURL: null,
              };
            }
            return snapshot.data() as AppUser;
          }),
          tap((user) => {
            this.usersCache[user.uid] = {
              invalidate: Date.now() + 60 * 60 * 1000,
              data: user,
            };
          }),
        );
      }),
    );
  }
}
