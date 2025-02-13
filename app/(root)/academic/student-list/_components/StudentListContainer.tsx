"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, GraduationCap, Home, Phone, User, Users } from "lucide-react"
import { useState } from "react"

type Student = {
    id: number
    name: string
    class: number
    section: string
    department?: "Science" | "Commerce" | "Arts"
    roll: number
    imageUrl: string
    bloodGroup: string
    fatherName: string
    motherName: string
    fatherPhone: string
    motherPhone: string
    address: string
}

// Updated sample student data
const students: Student[] = [
    {
        id: 1,
        name: "রহিম আহমেদ",
        class: 6,
        section: "A",
        roll: 1,
        imageUrl: "/photos/Kids/kids-1.jpg?height=100&width=100",
        bloodGroup: "A+",
        fatherName: "কামাল আহমেদ",
        motherName: "ফারিহা বেগম",
        fatherPhone: "০১৭১২৩৪৫৬৭৮",
        motherPhone: "০১৮১২৩৪৫৬৭৮",
        address: "১২৩, গ্রীন রোড, ঢাকা",
    },
    {
        id: 2,
        name: "ফাতেমা খানম",
        class: 6,
        section: "B",
        roll: 2,
        imageUrl: "/photos/Kids/kids-2.jpg?height=100&width=100",
        bloodGroup: "B-",
        fatherName: "জহির খান",
        motherName: "নাজমা খানম",
        fatherPhone: "০১৯১২৩৪৫৬৭৮",
        motherPhone: "০১৬১২৩৪৫৬৭৮",
        address: "৪৫, নিউ মার্কেট, চট্টগ্রাম",
    },
    {
        id: 3,
        name: "করিম উদ্দিন",
        class: 7,
        section: "A",
        roll: 1,
        imageUrl: "/photos/Kids/kids-3.jpg?height=100&width=100",
        bloodGroup: "O+",
        fatherName: "রফিক উদ্দিন",
        motherName: "সালমা বেগম",
        fatherPhone: "০১৫১২৩৪৫৬৭৮",
        motherPhone: "০১৪১২৩৪৫৬৭৮",
        address: "৭৮, পুরানা পল্টন, ঢাকা",
    },
    {
        id: 4,
        name: "নাজমা আক্তার",
        class: 7,
        section: "B",
        roll: 2,
        imageUrl: "/photos/Kids/kids-4.jpg?height=100&width=100",
        bloodGroup: "AB+",
        fatherName: "আলী হোসেন",
        motherName: "রেহানা বেগম",
        fatherPhone: "০১৩১২৩৪৫৬৭৮",
        motherPhone: "০১২১২৩৪৫৬৭৮",
        address: "৫৬, কাজী নজরুল ইসলাম এভিনিউ, খুলনা",
    },
    {
        id: 5,
        name: "আলী হাসান",
        class: 8,
        section: "A",
        roll: 1,
        imageUrl: "/photos/Kids/kids-5.jpg?height=100&width=100",
        bloodGroup: "A-",
        fatherName: "মোস্তাফিজুর রহমান",
        motherName: "শাহানা পারভীন",
        fatherPhone: "০১৮২৩৪৫৬৭৮৯",
        motherPhone: "০১৭২৩৪৫৬৭৮৯",
        address: "৩৪, শহীদ সাগর রোড, সিলেট",
    },
    {
        id: 6,
        name: "সুমাইয়া ইসলাম",
        class: 8,
        section: "B",
        roll: 2,
        imageUrl: "/photos/Kids/kids-6.jpg?height=100&width=100",
        bloodGroup: "B+",
        fatherName: "আব্দুল করিম",
        motherName: "নাসরিন সুলতানা",
        fatherPhone: "০১৯২৩৪৫৬৭৮৯",
        motherPhone: "০১৬২৩৪৫৬৭৮৯",
        address: "৯০, আজিমপুর রোড, ঢাকা",
    },
    {
        id: 7,
        name: "মাহমুদ হাসান",
        class: 9,
        section: "A",
        department: "Science",
        roll: 1,
        imageUrl: "/photos/Kids/kids-1.jpg?height=100&width=100",
        bloodGroup: "O-",
        fatherName: "জসিম উদ্দিন",
        motherName: "ফারজানা আক্তার",
        fatherPhone: "০১৫২৩৪৫৬৭৮৯",
        motherPhone: "০১৪২৩৪৫৬৭৮৯",
        address: "২৩, গুলশান এভিনিউ, ঢাকা",
    },
    {
        id: 8,
        name: "তানিয়া আক্তার",
        class: 9,
        section: "B",
        department: "Science",
        roll: 2,
        imageUrl: "/photos/Kids/kids-2.jpg?height=100&width=100",
        bloodGroup: "AB-",
        fatherName: "আনোয়ার হোসেন",
        motherName: "রুবিনা খাতুন",
        fatherPhone: "০১৩২৩৪৫৬৭৮৯",
        motherPhone: "০১২২৩৪৫৬৭৮৯",
        address: "৬৭, মতিঝিল, ঢাকা",
    },
    {
        id: 9,
        name: "রাফি আহমেদ",
        class: 9,
        section: "A",
        department: "Commerce",
        roll: 1,
        imageUrl: "/photos/Kids/kids-3.jpg?height=100&width=100",
        bloodGroup: "A+",
        fatherName: "শফিকুল ইসলাম",
        motherName: "নাজনীন নাহার",
        fatherPhone: "০১৮৩৪৫৬৭৮৯০",
        motherPhone: "০১৭৩৪৫৬৭৮৯০",
        address: "৪৫, নয়াপল্টন, ঢাকা",
    },
    {
        id: 10,
        name: "নুসরাত জাহান",
        class: 9,
        section: "A",
        department: "Arts",
        roll: 1,
        imageUrl: "/photos/Kids/kids-4.jpg?height=100&width=100",
        bloodGroup: "B-",
        fatherName: "মাহমুদুল হাসান",
        motherName: "শাহনাজ বেগম",
        fatherPhone: "০১৯৩৪৫৬৭৮৯০",
        motherPhone: "০১৬৩৪৫৬৭৮৯০",
        address: "১২, ধানমন্ডি, ঢাকা",
    },
    {
        id: 11,
        name: "সাদিয়া হক",
        class: 10,
        section: "A",
        department: "Science",
        roll: 1,
        imageUrl: "/photos/Kids/kids-5.jpg?height=100&width=100",
        bloodGroup: "O+",
        fatherName: "আব্দুল হক",
        motherName: "সালমা আক্তার",
        fatherPhone: "০১৫৩৪৫৬৭৮৯০",
        motherPhone: "০১৪৩৪৫৬৭৮৯০",
        address: "৮৯, বনানী, ঢাকা",
    },
    {
        id: 12,
        name: "ইমরান খান",
        class: 10,
        section: "B",
        department: "Science",
        roll: 2,
        imageUrl: "/photos/Kids/kids-6.jpg?height=100&width=100",
        bloodGroup: "AB+",
        fatherName: "জাহাঙ্গীর আলম",
        motherName: "রেহানা পারভীন",
        fatherPhone: "০১৩৩৪৫৬৭৮৯০",
        motherPhone: "০১২৩৪৫৬৭৮৯০",
        address: "৫৬, মিরপুর, ঢাকা",
    },
    {
        id: 13,
        name: "নাফিসা ইসলাম",
        class: 10,
        section: "A",
        department: "Commerce",
        roll: 1,
        imageUrl: "/photos/Kids/kids-1.jpg?height=100&width=100",
        bloodGroup: "A-",
        fatherName: "নজরুল ইসলাম",
        motherName: "ফেরদৌসী বেগম",
        fatherPhone: "০১৮৪৫৬৭৮৯০১",
        motherPhone: "০১৭৪৫৬৭৮৯০১",
        address: "৭৮, উত্তরা, ঢাকা",
    },
    {
        id: 14,
        name: "তারেক রহমান",
        class: 10,
        section: "A",
        department: "Arts",
        roll: 1,
        imageUrl: "/photos/Kids/kids-2.jpg?height=100&width=100",
        bloodGroup: "B+",
        fatherName: "আবদুর রহমান",
        motherName: "তাহমিনা খাতুন",
        fatherPhone: "০১৯৪৫৬৭৮৯০১",
        motherPhone: "০১৬৪৫৬৭৮৯০১",
        address: "২৩, মোহাম্মদপুর, ঢাকা",
    },
]

const classes = [6, 7, 8, 9, 10]
const departments = ["Science", "Commerce", "Arts"]
const sections = ["A", "B", "C"]

export default function StudentListContainer() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClass, setSelectedClass] = useState("6")
    const [selectedDepartment, setSelectedDepartment] = useState("Science")
    const [selectedSection, setSelectedSection] = useState("All")
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    const filteredStudents = students.filter(
        (student) =>
            student.class.toString() === selectedClass &&
            (selectedClass === "9" || selectedClass === "10" ? student.department === selectedDepartment : true) &&
            (selectedSection === "All" || student.section === selectedSection) &&
            (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.roll.toString().includes(searchTerm)),
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">আমাদের শিক্ষার্থীগণ</h1>

            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="নাম বা রোল নম্বর দিয়ে অনুসন্ধান করুন"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm mx-auto"
                />
            </div>

            <Tabs value={selectedClass} onValueChange={setSelectedClass} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-5 bg-green-100">
                    {classes.map((classNum) => (
                        <TabsTrigger key={classNum} value={classNum.toString()}>
                            {classNum} শ্রেণী
                        </TabsTrigger>
                    ))}
                </TabsList>

                {classes.map((classNum) => (
                    <TabsContent key={classNum} value={classNum.toString()}>
                        {(classNum === 9 || classNum === 10) && (
                            <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="w-full mb-4">
                                <TabsList className="grid w-full grid-cols-3">
                                    {departments.map((dept) => (
                                        <TabsTrigger key={dept} value={dept}>
                                            {dept === "Science" ? "বিজ্ঞান" : dept === "Commerce" ? "বাণিজ্য" : "কলা"}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        )}

                        <div className="flex justify-end mb-4">
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="সেকশন নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">সকল সেকশন</SelectItem>
                                    {sections.map((section) => (
                                        <SelectItem key={section} value={section}>
                                            সেকশন {section}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <Card key={student.id} className="flex flex-col">
                                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={student.imageUrl} alt={student.name} />
                                            <AvatarFallback>
                                                {student.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{student.name}</CardTitle>
                                            <Badge variant="secondary" className="mt-1">
                                                রোল: {student.roll}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex items-center mt-2">
                                            <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <p className="text-sm">{student.class} শ্রেণী</p>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <p className="text-sm">সেকশন {student.section}</p>
                                        </div>
                                        {(student.class === 9 || student.class === 10) && (
                                            <div className="flex items-center mt-2">
                                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <p className="text-sm">
                                                    {student.department === "Science"
                                                        ? "বিজ্ঞান"
                                                        : student.department === "Commerce"
                                                            ? "বাণিজ্য"
                                                            : "কলা"}{" "}
                                                    বিভাগ
                                                </p>
                                            </div>
                                        )}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => setSelectedStudent(student)}
                                                >
                                                    বিস্তারিত দেখুন
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {filteredStudents.length === 0 && (
                            <p className="text-center text-muted-foreground mt-8">কোন শিক্ষার্থী পাওয়া যায়নি। অনুগ্রহ করে আবার অনুসন্ধান করুন।</p>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedStudent?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Avatar className="h-24 w-24 col-span-1">
                                <AvatarImage src={selectedStudent?.imageUrl} alt={selectedStudent?.name} />
                                <AvatarFallback>
                                    {selectedStudent?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="col-span-3">
                                <p>
                                    <strong>শ্রেণী:</strong> {selectedStudent?.class}
                                </p>
                                <p>
                                    <strong>সেকশন:</strong> {selectedStudent?.section}
                                </p>
                                <p>
                                    <strong>রোল:</strong> {selectedStudent?.roll}
                                </p>
                                {(selectedStudent?.class === 9 || selectedStudent?.class === 10) && (
                                    <p>
                                        <strong>বিভাগ:</strong>{" "}
                                        {selectedStudent?.department === "Science"
                                            ? "বিজ্ঞান"
                                            : selectedStudent?.department === "Commerce"
                                                ? "বাণিজ্য"
                                                : "কলা"}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>রক্তের গ্রুপ:</strong> {selectedStudent?.bloodGroup}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>পিতার নাম:</strong> {selectedStudent?.fatherName}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>মাতার নাম:</strong> {selectedStudent?.motherName}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>পিতার ফোন:</strong> {selectedStudent?.fatherPhone}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>মাতার ফোন:</strong> {selectedStudent?.motherPhone}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                                <p>
                                    <strong>ঠিকানা:</strong> {selectedStudent?.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

