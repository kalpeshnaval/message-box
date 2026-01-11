import dbConnect from "@/lib/db";
import Note from "@/model/Note";
import { NextResponse } from "next/server";

export async function DELETE(request, {params}) {
    try {
        const {id} = await params
        await dbConnect()
        const note = await Note.findByIdAndDelete(id)

        if(!note) {
            return NextResponse.json({
                success: false,
                error: "failed to delete note"
            }, {state: 500})
        }

        return NextResponse.json({
            success: true,
            data: {}
        }, {status: 201})

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error || "something wrong happened"
        }, {status: 500})
        
    }

}

export async function PUT(request, {params}) {
    try {
        const {id} = await params
        await dbConnect()

        const body = await request.json()

        const note = await Note.findByIdAndUpdate(
            id,
            {...body, updatedAt: new Date()},
            {new: true, runValidators: true}
        )

        if(!note) {
            return NextResponse.json({
                success: false,
                error: "failed to update note"
            }, {status: 400})
        }

        return NextResponse.json({
            success: true,
            data: note
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error || "something wrong happened"
        }, {status: 500})
    }

}